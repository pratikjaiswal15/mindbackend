const mongoose = require('mongoose');
const Schema = mongoose.Schema;
    

// create employee schema and model

const EmployeeSchema = new Schema({

    email: {
        type: String,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Enter valid email."
        },
        required: [true, 'Email is required'],

    },

    first_name: {
        type: String,
        required: [true, 'First Name is required'],
        validate: {
            validator: function (arr) {
                return arr.length > 2;
            },
            message: "Enter valid first name."
        }
    },

    last_name: {
        type: String,
        required: [true, 'last Name is required'],
        validate: {
            validator: function (arr) {
                return arr.length > 2;
            },
            message: "Enter valid last name."
        }
    },

    address: {
        type: String,
        required: [true, 'address is required']
    },

    dob : {
        type: String,
        required : [true, 'date of birth is required']
    },


    mobile_number: {
        type: String,
        unique: true,
        required: [true, 'This field is required'],
        validate: {
            validator: function(v) {
                var re = /^\d{10}$/;
                return (v == null || v.trim().length < 1) || re.test(v)
            },
            message: 'Provided phone number is invalid.'
        }
    },

    city : {
        type: String,
        required : [true, 'comapany name is required']

    }

});

     

const Employee = mongoose.model('employee', EmployeeSchema);
module.exports = Employee
