const mongoose = require("mongoose");

const Counter = require('./counter');


const employee_schema = new mongoose.Schema({

    employeeID: {type: String, unique: true},
    name: String,
    address: {
        street: String,
        city: String
    },
    gender: String,
    birthday: String,
    registeredYear: String,
    registeredMonth: String,
    registeredDay: String,
    ID_number: String,
    image: String,
    status: String,
    contact: {

        mobile_number: String,
        telephone_number: String
    },
    NIC_pic: String
});



// Pre-save hook to generate employee ID before saving

employee_schema.pre('save', async function (next) {
    const doc = this;
    if (this.isNew) { // Only generate ID if the document is new
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'employeeID' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            doc.employeeID = `E${counter.seq}`;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        // If the document is not new, proceed without changing the ID
        next();
    }
});


//exporting the employee module
module.exports = mongoose.model("employee_details", employee_schema);
