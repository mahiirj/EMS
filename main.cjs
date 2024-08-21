const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const mongoose = require("mongoose");
const employee_details = require('./employee_details');
const Counter = require('./counter');
const { Item, Subpart } = require('./item_details');
const attendance_details = require('./attendance_details');

const item_details = Item;



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

    const birthday = formData.dateOfBirth;

    async function run() {

        try {
            const employee = new employee_details({
                name: name,
                address: {
                    street: street,
                    city: city
                },
                gender: gender,
                birthday: birthday,
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
                birthday: employee.birthday,
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


//opening the NIC and profile picture changes for the employee update


let updated_imageData;

let updated_NIC_imageData;

//open the file dialog to select a profile picture

ipcMain.on('open-file-update-dialog', async (event) => {

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
        updated_imageData = `data:image/png;base64,${image_Data}`
        
        mainWindow.webContents.send("send_profile:send",updated_imageData);
    }
});


//open the file dialog to select an NIC picture

ipcMain.on('open-NIC-update-dialog', async (event) => {

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
        updated_NIC_imageData = `data:image/png;base64,${NIC_image_Data}`

        console.log("image data",updated_NIC_imageData);

        mainWindow.webContents.send("send_NIC:send",updated_NIC_imageData);
    }
});






//recieving the updated info on save

ipcMain.on('send_edited_info:send',function(event,editedEmployee){

    console.log(editedEmployee);

    const edited_id = editedEmployee.id;

    const address = editedEmployee.address;
    
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

    //extracting the registered date

    const registeredDate = editedEmployee.registeredDate;

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

  // function to update the edited employee details form the profile


        async function update_employees(editedEmployee,edited_id,street,city,registeredYear,registeredMonth,registeredDay)

                {

                    const employee = await employee_details.findOne({employeeID: edited_id});

                    employee.address.street = street;
                    employee.address.city = city;
                    employee.gender = editedEmployee.gender;
                    employee.birthday = editedEmployee.registeredDate;
                    employee.registeredYear = registeredYear;
                    employee.registeredMonth = registeredMonth;
                    employee.registeredDay = registeredDay;
                    employee.ID_number = editedEmployee.idNumber;
                    employee.image = updated_imageData;
                    employee.NIC_pic = updated_NIC_imageData;
                    employee.contact.mobile_number = editedEmployee.mobile_number;
                    employee.contact.telephone_number = editedEmployee.telephone_number;


                    console.log("updated employee",employee);

                    employee.save();

                }


                    //calling the update employee function

                    update_employees(editedEmployee,edited_id,street,city,registeredYear,registeredMonth,registeredDay)


});



//adding an item to the database

ipcMain.on("item:add", function (e,formData) {


    async function addItem() {

        try {

            const item = new item_details({

                    name: formData.itemName,

                    subparts:formData.subitems,

                    itemStatus: "active"

                });
            

            await item.save();
            

            console.log(item);

            console.log("item successfully added to the database");

        } catch (e) {

            console.log(e.message);
        }
    }

    addItem();

    
});



//recieve refresh items request

ipcMain.on("refresh_items:send",function(){

    iterateitems();


});


//get all the items currently exist in the database


async function iterateitems(){

    try{
      
      const items = await item_details.find();

      let item_array = [];

      items.forEach(item =>{
          
         
        //   const item_id = item.itemID;

        //   const item_name = item.name;
        
        //   const item_status = item.itemStatus;

          const item_subparts = item.subparts;

          const subpart_array = [];

          item_subparts.forEach(subpart=>{

                let sub_object = {

                    name: subpart.name,
                    price: subpart.price
                }

                
                subpart_array.push(sub_object);
          })


          item_object = {

            id:item.itemID,
            itemName:item.name,
            status:item.itemStatus,
            subitems:subpart_array
            
          }

          item_array.push(item_object);

        //   popupWindow4.webContents.send("punchout_list:send",item_id,item_name, item_status, subpart_array);

          console.log(item);

      })

      mainWindow.webContents.send("item_list:send",item_array);

  }catch(error){

      console.log(error);

      console.log("error iterating through the items");

  }

}


//catching the search reqyuest from the main

ipcMain.on("search_item:send",function(e,searchQuery){

    search_items(searchQuery);

});



//search function to search through every item

async function search_items(searchQuery) {

    // Attempt to convert search_info to a number

    const search_price = Number(searchQuery);
    
    const isNumber = !isNaN(search_price);

    try {

        let item_array = [];

        const SearchCriteria = {
            $or: [
                { itemID: searchQuery},
                { name: new RegExp(searchQuery, 'i') }, // Case-insensitive search for item name
                { itemStatus: searchQuery },
                {
                    subparts: {

                        $elemMatch: {

                            $or: [
                                { name: new RegExp(searchQuery, 'i') }, // Case-insensitive search for subpart name
                                
                                ...(isNumber ? [{ price: searchQuery }] : []) // Only include price condition if it's a valid number
                            ]

                        }
                    }
                }
            ]
        };

        const matchingItems = await Item.find(SearchCriteria).exec();

        // Clear the table before displaying the search results

        // Assuming addWindow3 and the necessary setup exist in your application

        // addWindow3.webContents.send("item_list:clear");


        // Iterate through the matching items and send the data to the renderer process

        matchingItems.forEach(item => {

            const item_subparts = item.subparts;

            const subpart_array = [];

            item_subparts.forEach(subpart=>{

                    let sub_object = {

                        name: subpart.name,
                        price: subpart.price
                    }

                    
                    subpart_array.push(sub_object);
            })


            item_object = {

                id:item.itemID,
                itemName:item.name,
                status:item.itemStatus,
                subitems:subpart_array
                
            }

            item_array.push(item_object);


            // Send item details

            // addWindow3.webContents.send("item_list:send", item_id, item_name,item_status,subpart_array);


            console.log(item);

            console.log("Items have been found successfully");
        });

        mainWindow.webContents.send("item_list:send",item_array);


    } catch (error) {

        //error message
        console.error("Error searching items:", error);
    }
}


//item profile functionalities

ipcMain.on("item_profile_id:send",async function(e,item_id){

    console.log(item_id);


    display_item_profile(item_id);



})


//item profile dispplay function

    
async function display_item_profile (item_id){

    try{
      
      const items = await item_details.find();

      items.forEach(item =>{
          
        if (item_id == item.itemID){

            const item_subparts = item.subparts;

            const subpart_array = [];

            item_subparts.forEach(subpart=>{

                    let sub_object = {

                        name: subpart.name,
                        price: subpart.price
                    }

                    
                    subpart_array.push(sub_object);
            })


            item_object = {

                id:item.itemID,
                itemName:item.name,
                status:item.itemStatus,
                subitems:subpart_array
                
            }

            mainWindow.webContents.send("item_profile:send",item_object);


            console.log(item_object);

        
           
        }})

  }catch(error){

      console.log(error);

      console.log("error iterating through the profile items");

  }

}



//recieve the edited info

ipcMain.on('item_send_edited_info:send', async function(
    event,
    editedItem

) {

    console.log(editedItem);
    // Function to update the edited item details in the database

    async function update_items(
        editedItem
    ) {
        // Find the item by itemID

        const item = await item_details.findOne({ itemID: editedItem.id });

        if (item) {

            // Update item details

            item.name = editedItem.itemName;

            item.itemStatus = editedItem.status;

            // Update subparts if they exist

            item.subparts = editedItem.subitems;
            

            // Save the updated item to the database

            await item.save();

            console.log("Updated item:", item);

        } else {
            console.log("Item not found with ID:",editedItem.id);
        }
    }

    // Call the update items function
    update_items(
        editedItem

    ).catch(err => {

        console.error("Error updating item:", err);
    });

});


//obtain the name for the attendance table


ipcMain.on("obtain_name:send",function(e,punched_id){


    obtain_name(punched_id);

    async function obtain_name(punched_id){

        try{

        
            const employee = await employee_details.findOne({ employeeID: punched_id });


            const employee_name = employee.name;

            mainWindow.webContents.send("obtained_name:send",employee_name);
        }

        catch(error){

            console.log(error);

        }


    }

    
})


let punch_data;


//recieving the punchdata

ipcMain.on("punch_data:send",function(e,punchData){

    const currentTime = new Date().toLocaleTimeString();

    punchData.punchOutTime = currentTime;

    console.log(punchData);

    punch_data = punchData;

    
   
})



//saving attendance details

ipcMain.on("punchout_data:save",async function(e,submissionData){

    console.log("I recieved the data");

    console.log(submissionData);

    console.log(punch_data);

    let total = 0;
   

    //extract the year,month and data seperately from the punch in date

    const dateString = punch_data[0].punchInTime;

    // Regex to match the date pattern (MM/DD/YYYY)

    const regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/;

    const [_, month, day, year] = dateString.match(regex);

    console.log(`Year: ${year}`);   // Output: "Year: 2024"
    console.log(`Month: ${month}`); // Output: "Month: 8"
    console.log(`Day: ${day}`);     // Output: "Day: 21"


    //function for appending data to the database

    async function add_attendance() {


        try {

            // Flatten the selectedItems and extract subitems to save in products_done

            const products_done = submissionData.selectedItems.flatMap(item => {
                return item.subitems.map(subitem => ({
                    name: subitem.name,
                    quantity: subitem.quantity,
                    price: subitem.price,
                }));
            });

            const attendance = new attendance_details({

                    daily_payment: submissionData.grandTotal,

                    name: punch_data[0].name,

                    Punch_in_time: punch_data[0].punchInTime,

                    Punch_out_time: punch_data.punchOutTime,

                    Year: year,

                    Month: month,

                    Day: day,

                    employeeID: punch_data[0].employeeNumber,

                    products_done: products_done,

                });
            

            await attendance.save();
            
            //send the just now saved item details to the addwindow3

            console.log(attendance);

            console.log("attendance record successfully added to the database");

        } catch (e) {

            console.log(e.message);
        }
    }

    await add_attendance();



})






//recieving the attendance search requests

ipcMain.on("attendance_search:send", async function(e, employeeIdOrName, year, month, day) {

    // Convert all inputs to strings

    const employeeIdOrNameStr = employeeIdOrName ? String(employeeIdOrName).trim() : '';
    const yearStr = year ? String(year).trim() : '';
    const monthStr = month ? String(month).trim() : '';
    const dayStr = day ? String(day).trim() : '';


    // If only the employee ID or name is available, get the past 10 records of attendance

    if (employeeIdOrNameStr !== '' && yearStr === '' && monthStr === '' && dayStr === '') {

        // Only employee ID or name is provided
        const query = {
            $or: [
                { employeeID: employeeIdOrNameStr },
                { name: employeeIdOrNameStr }
            ]
        };

        // Sort by the most recent and limit to 10 records
        try {
            const records = await attendance_details.find(query).sort({ Year: -1, Month: -1, Day: -1 }).limit(10).lean();
            console.log(records);
            mainWindow.webContents.send("attendance_search:result", records);
        } catch (err) {
            console.error(err);
        }
    }

    // If the year, month, and day are provided, get the day's record of attendance for the company

    if (employeeIdOrNameStr === '' && yearStr !== '' && monthStr !== '' && dayStr !== '') {

        // Year, month, and date are provided (company-wide search for a specific day)

        const query = {
            Year: yearStr,
            Month: monthStr,
            Day: dayStr
        };

        try {
            const records = await attendance_details.find(query).lean();
            console.log(records);
            mainWindow.webContents.send("attendance_search:result", records);
        } catch (err) {
            console.error(err);
        }
    }

    // If the employee ID or name and year and month are provided, get the monthly attendance record of the employee

    if (employeeIdOrNameStr !== '' && yearStr !== '' && monthStr !== '' && dayStr === '') {

        // Employee ID or name, and year and month are provided (monthly attendance for the employee)

        const query = {
            $or: [
                { employeeID: employeeIdOrNameStr },
                { name: employeeIdOrNameStr }
            ],
            Year: yearStr,
            Month: monthStr
        };

        try {
            const records = await attendance_details.find(query).lean();
            console.log(records);
            mainWindow.webContents.send("attendance_search:result", records);
        } catch (err) {
            console.error(err);
        }
    }

    // If everything is present, get the single attendance record of the specific employee on the specific date

    if (employeeIdOrNameStr !== '' && yearStr !== '' && monthStr !== '' && dayStr !== '') {

        // All parameters are provided (specific attendance record for the employee on the specific date)

        const query = {
            $or: [
                { employeeID: employeeIdOrNameStr },
                { name: employeeIdOrNameStr }
            ],
            Year: yearStr,
            Month: monthStr,
            Day: dayStr
        };

        try {
            const records = await attendance_details.find(query).lean();

            console.log(records);

            mainWindow.webContents.send("attendance_search:result", records);
            
        } catch (err) {
            console.error(err);
        }
    }
});


































