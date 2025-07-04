const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');

// DATABASE HANDLING FUNCTIONS
async function getCustomers() {
    const customers = await Customer.find().sort('name');
    return customers;
}

async function createCustomer(body) {
    let customer = Customer({
        isGold: body.isGold,
        phone: body.phone,
        name: body.name
    });

    try {
        customer = await customer.save();
        return customer;
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
}

// USER INTERACTION FUNCTIONS
router.get('/', async (req, res) => {
    const customers = await getCustomers();
    res.send(customers);
})

router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
        if (!customer) return res.status(404).send('The customer with the given ID does not exist...');
        res.send(customer);
    } catch (err) {
        res.status(400).send('Invalid ID format');
    }
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await createCustomer(req.body);

    res.status(201).send(customer);
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, { isGold: req.body.isGold, phone: req.body.phone, name: req.body.name }, {
        new: true
    })

    if (!customer) return res.status(404).send('The customer with the given ID was not found');
    res.send(customer);
})

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id, {
        new: true
    })

    if (!customer) return res.status(404).send('The customer with the given ID was not found');

    res.send(customer);
})

module.exports = router;