const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    studentEmail: String,
    dailCode: Number,
    studentPhone: Number,
    pass: String
});

module.exports = {
    dataSchema,
}