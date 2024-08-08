const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const mongoose = require('mongoose');
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
        const imageData = await fs.readFile(filePath, 'base64');
        event.sender.send('selected-file', filePath, `data:image/png;base64,${imageData}`);
    }
});




//catching the employee:add request to enter the employee details into the database

ipcMain.on("employee:add", function (e,formData) {

    // const name;
    // const street;
    // const city;
    // const gender;
    // const birthday;
    // const registeredYear;
    // const registeredMonth;
    // const registeredDay;
    // const id_number;
    // const imageData;
    // const NIC_imageData;
    // const mob_number;
    // const tel_number;


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
                    telephone_number: tel_number

                }
                
            });

            await employee.save();
            
            //send the just now saved employee details to the addwindow1
            mainWindow.webContents.send("employee:add", name, street, city, gender, birthday, registeredYear, registeredMonth, registeredDay, id_number, imageData,employee.employeeID,NIC_imageData,mob_number,tel_number);
            console.log(employee);
            console.log("employee successfully added to the database");

        } catch (e) {
            console.log(e.message);
        }
    }

    run();

    
});



