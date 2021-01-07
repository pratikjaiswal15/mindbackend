const express = require('express');
const router = express.Router();
const Employee = require('../models/employee-model')


// register employee with hashed password
router.post('/employees', (req, res, next) => {

    console.log(req.body)
    let data = new Employee({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        dob: req.body.dob,
        mobile_number: req.body.mobile_number,
        city: req.body.city
    })
    console.log(data)

    Employee.create(data).then(val => {
        res.send(val)
    }).catch(next)

})

// list all employees 
router.get('/employees', (req, res, next) => {

    Employee.find().then(data => {
        res.send(data)
    }).catch(next)
})

// list one user
router.get('/employees/:id',   (req, res, next) => {

    Employee.findById(req.params.id).then(data => {
        if (data) {
            res.send(data)
        }
        else {
            res.send("no Employee found")
        }
    }).catch(next)
})


// Update user with token
router.patch('/employees/:id', (req, res, next) => {

    var opts = { runValidators: true };

    Employee.findByIdAndUpdate({ _id: req.params.id }, req.body, opts).then(() => {
        Employee.findOne({ _id: req.params.id }).then(data => {
            res.send(data)
        }).catch(next)
    }).catch(next)

})

// delete Employee
router.delete('/employees/:id', (req, res, next) => {

    Employee.findByIdAndRemove({ _id: req.params.id }).then(data => {
        if (data) {
            res.send("successfully deleted")
        }
        else {
            res.send("No user found")
        }
    }).catch(next)
})



module.exports = router