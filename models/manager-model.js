const mongoose = require('mongoose');
const Schema = mongoose.Schema;
      bcrypt = require('bcrypt'),
      SALT_WORK_FACTOR = 10;


// create manager schema and model

const ManagerSchema = new Schema({

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

    password : {
        type : String,
        required: [true, 'Password is required'],
        min : 6,
        max : 1024
    },

    address: {
        type: String,
        required: [true, 'address is required']
    },

    dob : {
        type: String,
        required : [true, 'date of birth is required']
    },

    company : {
        type: String,
        required : [true, 'comapany name is required']

    }

});

ManagerSchema.pre('save', function(next) {
    var manager = this;

    // only hash the password if it has been modified (or is new)
    if (!manager.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(manager.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            manager.password = hash;
            next();
        });
    });
});
     
ManagerSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

const Manager = mongoose.model('manager', ManagerSchema);
module.exports = Manager
