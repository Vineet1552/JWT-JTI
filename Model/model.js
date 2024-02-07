const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    studentEmail: String,
    dailCode: Number,
    studentPhone: Number,
    pass: String,
    jti: String
});

const MarksSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Data'
    },
    subject: String,
    marks: Number
});

const Data1 = mongoose.model('Data', dataSchema);
const Data2 = mongoose.model('Data2', MarksSchema);

module.exports = {
    Data1,
    Data2
};
