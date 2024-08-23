// Importing mongoose module
const mongoose = require('mongoose');

// Creating new schema
const punchSchema = new mongoose.Schema({

    employeeID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    Punch_in_time: {
        type: String,
        default:null
    },
    Punch_out_time: {
        type: String,
        default: null // Will be updated later
    },
    Year: {
        type: String,
        required: true
    },
    Month: {
        type: String,
        required: true
    },
    Date: {
        type: String,
        required: true
    }
});

// Exporting the punch module
module.exports = mongoose.model('punchin_details', punchSchema);