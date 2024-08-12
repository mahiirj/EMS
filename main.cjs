const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const mongoose = require("mongoose");
const employee_details = require('./employee_details');
const Counter = require('./counter');



//connecting to mongodb

//mongo db connection ensure
mongoose.connect('mongodb://localhost:27017/Garment', { useNewUrlParser: true, useUnifiedTopology: true })

    .then(async() => {

        console.log('Connected to MongoDB');

        // Initialize the counter if it does not exist
        const counter = await Counter.findById('employeeID');
        if (!counter) {
            await new Counter({ _id: 'employeeID', seq: 0 }).save();
        }

    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
});



let mainWindow;

app.on('ready', () => {

    

    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        title: "See employee details",
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    const startUrl = process.env.VITE_DEV_SERVER_URL || path.join(__dirname, 'dist', 'index.html');

    mainWindow.loadURL(startUrl);

    mainWindow.on('closed', () => {

        app.quit();
    });
});



let imageData;

let NIC_imageData;

//open the file dialog to select a profile picture

ipcMain.on('open-file-dialog', async (event) => {

    console.log("Received file open dialog request");

    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
        ]
    });

    if (!result.canceled) {
        const filePath = result.filePaths[0];
        const image_Data = await fs.readFile(filePath, 'base64');
        imageData = `data:image/png;base64,${image_Data}`
        // event.sender.send('selected-file', filePath, `data:image/png;base64,${imageData}`);
    }
});


//open the file dialog to select an NIC picture

ipcMain.on('open-NIC-dialog', async (event) => {

    console.log("Received file open dialog request");

    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
        ]
    });

    if (!result.canceled) {
        const NIC_filePath = result.filePaths[0];
        const NIC_image_Data = await fs.readFile(NIC_filePath, 'base64');
        NIC_imageData = `data:image/png;base64,${NIC_image_Data}`
        // event.sender.send('selected-file', NIC_filePath, `data:image/png;base64,${NIC_imageData}`);
    }
});



//catching the employee:add request to enter the employee details into the database

ipcMain.on("employee:add", function (e,formData) {

    const name = formData.name;

    const address = formData.address;
    //functin to split the address string

    function splitString(input) {
        // Split the string by commas
        const parts = input.split(',');
    
        // Combine the first two parts with a comma
        const firstPart = parts.slice(0, 2).join(',');
    
        // The rest of the string is the second part
        const secondPart = parts.slice(2).join(',');
    
        return [firstPart, secondPart];
    }


    const [street, city] = splitString(address);


    const gender = formData.gender;

    const registeredDate = formData.registeredDate;



    let registered_month;

    let registered_year;

    let registered_day;

    // Regular expression to match the date format YYYY-MM-DD
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;


    // Apply the regex to the date string

    const match = registeredDate.match(regex);

    if (match) {
        registered_year= match[1];
        registered_month= match[2];
        registered_day= match[3];

        console.log(registered_year);

    } else {
        console.log("Invalid date format");
    }


    const registeredYear = registered_year;

    const registeredMonth = registered_month;

    const registeredDay = registered_day;

    const id_number = formData.idNumber;

    const mob_number = formData.mobile_number;

    const telephone_number = formData.telephone_number;

    async function run() {

        try {
            const employee = new employee_details({
                name: name,
                address: {
                    street: street,
                    city: city
                },
                gender: gender,
                birthday: registeredDate,
                registeredYear: registeredYear,
                registeredMonth: registeredMonth,
                registeredDay: registeredDay,
                ID_number: id_number,
                image: imageData,
                status: "active",
                NIC_pic: NIC_imageData,
                contact:{

                    mobile_number: mob_number,
                    telephone_number: telephone_number

                }
                
            });

            await employee.save();
            
            //send the just now saved employee details to the addwindow1

            

            console.log(employee);

            console.log("employee successfully added to the database");

        } catch (e) {

            console.log(e.message);
        }
    }

    run();

    
});



//employee-refresh request recieved

ipcMain.on('employee_refresh',function(e){

    console.log("request recieved");

    iterateemployees();


})


//function to iterate through the employees and fetch the data

async function iterateemployees(event){

    let employee_array = [];

    try{
      
      const employees = await employee_details.find();

      employees.forEach(employee =>{

        let emData = {

            id: employee.employeeID,
            employee_pic: employee.image,
            name: employee.name,
            id_number: employee.ID_number,
            status: employee.status,
            mobile: employee.contact.mobile_number,
            telephone: employee.contact.telephone_number,
            nicPicture: employee.NIC_pic,
        };

        employee_array.push(emData);

        console.log(emData);

        emData = null;
        
        
     })

      mainWindow.webContents.send("employee_list:send", employee_array);

  }catch(error){

      console.log(error);

      console.log("error iterating through the items");

  }


}


//recieving search employee queries

ipcMain.on('sending_search:find',function(e,searchQuery){


    search_employees(searchQuery);
    
})


//get all the employees related to the search query

async function search_employees(searchQuery){

    let employee_array = [];


    try{

        const SearchCriteria = {

            $or:[

                { employeeID: searchQuery },

                { name: new RegExp(searchQuery, 'i') }, // Case-insensitive search

                { ID_number: searchQuery },

                { 'contact.mobile_number': searchQuery },

                { 'contact.telephone_number': searchQuery},

                { status: { $regex: `^${searchQuery}$`, $options: 'i' } }  //case insensitive search and exact match


            ]

        };

        const matchingEmployees = await employee_details.find(SearchCriteria);

        // Clear the table before displaying the search results

        mainWindow.webContents.send("employee_list:clear");


        // Iterate through the matching employees and send the data to the renderer process

        matchingEmployees.forEach(employee => {

            let emData = {

                id: employee.employeeID,
                employee_pic: employee.image,
                name: employee.name,
                id_number: employee.ID_number,
                status: employee.status,
                mobile: employee.contact.mobile_number,
                telephone: employee.contact.telephone_number,
                nicPicture: employee.NIC_pic,
            };
    
            employee_array.push(emData);
    
            console.log(emData);
    
            emData = null;
            
            // addWindow1.webContents.send("employee_list_searched:found", employee_pic, employee_name, employee_NIC, employee_id, employee_status, employee_NIC_pic, employee_mobile_phone, employee_telephone, truncated_NIC);

            console.log("employees have been found successfully");

        })

        mainWindow.webContents.send("employee_list:send", employee_array);


    }  catch(error){

        console.log(error);

        console.log("error iterating through the searched items");

    }


}



//employee profile request recieved

ipcMain.on('profile_id:send', async (e,employee_id)=>{

    console.log(employee_id);

    display_profile(employee_id);


})


//function for displaying the requested search profile and sending the data to the renderer

async function display_profile (employee_id){

    try{
      
      const employees = await employee_details.find();

      employees.forEach(employee =>{
          
        if (employee_id == employee.employeeID){

            // Create an object with the required structure

            const employeeProfile = {

                id: employee.employeeID,
                name: employee.name,
                address: `${employee.address.street}, ${employee.address.city}`,
                gender: employee.gender,
                registeredDate: `${employee.registeredYear}-${employee.registeredMonth}-${employee.registeredDay}`,
                idNumber: employee.ID_number,
                profilePicture: employee.image,
                status: employee.status,
                mobile_number: employee.contact.mobile_number,
                telephone_number: employee.contact.telephone_number,
                nicPicture: employee.NIC_pic,
            }

           console.log(employeeProfile);
          
           mainWindow.webContents.send("employee_profile:recieve",employeeProfile);

           
        }})

  }catch(error){

      console.log(error);

      console.log("error iterating through the profile items");

  }

}

















