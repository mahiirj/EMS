
//importing mongoose module
const mongoose = require("mongoose");



//creating new schema

const salary_schema = new mongoose.Schema({

      employeeID: String,

      employee_name: String,

      Year: String,

      Month: String,

      Salary: Number,

      Status: String,


   }


)


//exporting the salary module

module.exports = mongoose.model("salary_details", salary_schema);