// Method/methods.js
const express = require("express");
const { Data1, Data2 } = require("../Model/model");
const { dataValidator, MarksValidate } = require("../Validator/Validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretkey = "secretkey";
const { v4: uuidv4 } = require("uuid");
const nodemailer = require('nodemailer');


// const app = require('../routes/routes')

const router = express();
router.use(express.json());

// const router = express.Router();

//getting one user by ID - working
module.exports.getOne = async (req, res) => {
  const ID = req.params._id;
  try {
    const student = await Data1.findById(ID);
    if (!student) {
      res.send({
        msg: "student is not exist",
      });
    }
    res.send({
      student,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(400).json({ error: "Internal server error" });
  }
};

// get for all - working
module.exports.getall = async (req, res) => {
  try {
    const users = await Data1.find({});
    return res.json({ users });
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(400).send("Internal error");
  }
};

// post for all user - working normal
// module.exports.postforAll = async (req, res) => {
//   try {
//     // const validationResult = await dataValidator.validateAsync(req.body);
//     // const { firstName, lastName, studentEmail, dailCode, studentPhone, pass } = validationResult;
//     await dataValidator.validateAsync(req.body);
//     // await Data1.create({
//     //     firstName,
//     //     lastName,
//     //     studentEmail,
//     //     dailCode,
//     //     studentPhone,
//     //     pass,
//     // });
//     const {
//       studentEmail,
//       studentPhone
//     } = req.body;

//     const exist = await Data1.findOne({
//       $or: [{ studentEmail }, { studentPhone }],
//     });

//     if (exist) {
//       res.send({
//         msg: "user alredy present",
//       });
//     } else {
//       const hash_pass = await bcrypt.hash(req.body.pass, 5);
//       req.body.pass = hash_pass;
//       await Data1.create(req.body);
//       res.send("User created successfully");
//     }

    
//   } catch (error) {
//     console.error("Error creating user", error);
//     return res.status(400).json({ error: error.message });
//   }
// };

//post for jwt - wroking
module.exports.Login = async (req, res) => {
  try {
    const { studentEmail, pass } = req.body;

    const student = await Data1.findOne({ studentEmail });

    if (!student) {
      return res.status(400).json({ msg: "Student not found" });
    }
    const isPasswordValid = await bcrypt.compare(pass, student.pass);
    if (isPasswordValid) {
      const jti = uuidv4(); // Generate unique token identifier
      // Update user document with new token
      await Data1.updateOne({ _id: student._id }, { $set: { jti: jti } });

      // Generate token using student._id
      jwt.sign({ studentId: student._id, jti }, secretkey, { expiresIn: '30s' }, (error, token) => {
        if (error) {
          console.error("Error generating token:", error);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.json({ token });
      });
    } else {
      res.status(401).json({ msg: "Invalid password" });
    }
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};



// profile validating - working

module.exports.profileValid = async (req, res) => {
  jwt.verify(req.token, secretkey, async (err, authData) => {
    if (err) {
      res.send({ msg: "invalid token" });
    } else {
      try {
        const userData = await Data1.findOne({ _id: authData.studentId }); 
        if (!userData) {
          return res.status(400).json({ msg: "user not found" });
        }
        if (userData.jti !== authData.jti) {
          return res.status(400).json({ msg: "Invalid token" });
        }
        res.json({
          msg: "Profile accessed",
          user: userData
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Internal server error" });
      }
    }
  });
};


//  till here jwt code

//working
module.exports.updateData = async (req, res) => {
  // console.log(req.params)
  try {
    await dataValidator.validateAsync(req.body);
    let data = await Data1.updateOne(req.params, {
      $set: req.body,
    });
    return res.send(data);
    // console.log(req.params);
  } catch (error) {
    console.error("Error creating user", error);
    return res.status(400).json({ error: error.message });
  }
};

// delete - working
module.exports.deleteData = async (req, res) => {
  try {
    let id = req.params.id;

    let data = await Data1.deleteOne({ _id: id });
    return res.send(data);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

// post for updating marks
module.exports.postMarks = async (req, res) => {
  try {
    await MarksValidate.validateAsync(req.body);
    const id = req.query.id;
    const existingUser = await Data1.findOne({ _id: id });

    if (!existingUser) {
      return res.status(404).json({ msg: "User does not exist" });
    }

    await Data2.create({
      id: req.query.id,
      subject: req.body.subject,
      marks: req.body.marks,
    });

    return res.status(200).json({ msg: "Marks updated successfully" });
  } catch (error) {
    console.error("Error updating marks", error);
    return res.status(400).send(error.message);
  }
};



// post for all the students with nodemailer
module.exports.postforAll = async (req, res) => {
  try {
    // const validationResult = await dataValidator.validateAsync(req.body);
    // const { firstName, lastName, studentEmail, dailCode, studentPhone, pass } = validationResult;
    await dataValidator.validateAsync(req.body);
    // await Data1.create({
    //     firstName,
    //     lastName,
    //     studentEmail,
    //     dailCode,
    //     studentPhone,
    //     pass,
    // });
    const {
      studentEmail,
      studentPhone
    } = req.body;

    const exist = await Data1.findOne({
      $or: [{ studentEmail }, { studentPhone }],
    });

    if (exist) {
      res.send({
        msg: "user alredy present",
      });
    } else {
      const hash_pass = await bcrypt.hash(req.body.pass, 5);
      req.body.pass = hash_pass;
      await Data1.create(req.body);
      await sendMail(studentEmail);
      res.send("User created successfully");
    }

    
  } catch (error) {
    console.error("Error creating user", error);
    return res.status(400).json({ error: error.message });
  }
};
// nodemailer
async function sendMail() {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'vermavineet688@gmail.com',
          pass: 'wtxl mkjy asdi axct'
      }
  });

  const mailOptions = {
      from: 'vermavineet688@gmail.com',
      to: 'nandankumar1475@gmail.com',
      subject: 'Varification',
      text: 'hello user',
      html: '<h1>your data Creted in Database Successfully</h1>'
  };

  try {
    await new Promise((resolve, reject) => {
      setTimeout(async () => {
          try {
              await transporter.sendMail(mailOptions);
              console.log('Email sent successfully');
              resolve();
          } catch (error) {
              console.log('Email send failed with error:', error);
              reject(error);
          }
      }, 3000);
  });
  } catch (error) {
      console.log('Email send failed with error:', error);
  }
}

module.exports.sendMail = sendMail;
