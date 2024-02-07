const express = require("express");
const mongoose = require("mongoose");
const app = require('./routes/routes')

const app1 = express();
const port = 3000;

app1.use(express.json());
app1.use(app);

app1.listen(port, async () => {
    try {
        await mongoose.connect("mongodb://0.0.0.0:27017/studentdata");
        console.log(`Listening on port number: ${port}`);
    } catch (error) {
        console.error("Mongoose connection error", error);
    }
});