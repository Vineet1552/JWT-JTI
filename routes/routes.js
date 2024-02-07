//routes/routes.js
const express = require('express');
const methods = require('../Method/methods');
const { verifyToken } = require('../Validator/Validator');

const app = express.Router();

app.get('/getOne/:_id', methods.getOne);
app.get('/get', methods.getall);
app.post('/post', methods.postforAll);
// app.post('/token/:studentEmail/:pass', methods.Login);
app.post('/token', methods.Login);
app.post('/profile',verifyToken, methods.profileValid);
app.put('/update/:_id', methods.updateData);
app.delete('/delete/:_id', methods.deleteData);
app.post('/updateMarks', methods.postMarks);

// app.get('/mail',methods.sendMail);

module.exports = app;