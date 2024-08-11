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


    //function to extract the year, month and date

    function extractDateComponents(registeredDate) {

        // Regular expression to match mm/dd/yy format
        const regex = /^(\d{2})\/(\d{2})\/(\d{2})$/;
    
        // Apply the regex to the date string
        const match = registeredDate.match(regex);
    
        if (match) {

            // Extract month, day, and year from the match result
            registered_month = match[1];
            registered_day = match[2];
            registered_year = match[3];
    
            return { registered_month, registered_day, registered_year };

        } else {

            // If the input string doesn't match the format, return null or an error
            return null;
        }
    }

    
    extractDateComponents(registeredDate);


    const registeredYear = registered_month;

    const registeredMonth = registered_month;

    const registeredDay = registered_day;

    const id_number = formData.idNumber;

    const mob_number = formData.contact;

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
                    telephone_number: mob_number

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





