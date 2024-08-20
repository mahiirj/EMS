const mongoose = require("mongoose");

const punchout_subpart_details = new mongoose.Schema({

    name: { type: String, required: true },
    quantity: {type: Number, required: true},
    price: { type: Number, required: true },

});


const attendance_schema = new mongoose.Schema({

    employeeID: String,
    name: String,
    Year: String,
    Month: String,
    Day: String,
    Punch_in_time: String,
    Punch_out_time: String,
    products_done: [punchout_subpart_details],
    daily_payment: Number
   
});


//exporting the attendance module
module.exports = mongoose.model("attendance_details", attendance_schema);
