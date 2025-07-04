const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    schema = Joi.object({
        isGold: Joi.boolean(),
        phone: Joi.string().required(),
        name: Joi.string().required()
    });

    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
