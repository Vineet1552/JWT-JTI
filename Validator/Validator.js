const joi = require('joi');

const dataValidator = joi.object({
  firstName: joi.string().optional(),
  lastName: joi.string().optional(),
  studentEmail: joi.string().email().optional(),
  dailCode: joi.number().valid(91).optional().error(new Error('Invalid dial code. Only 91 is allowed.')), 
  studentPhone: joi.number().optional().min(1000000000).max(9999999999).error(new Error('Phone number must be exactly 10 digits')),
  pass: joi.string().min(8).optional().error(new Error('Password must be at least 8 characters long.'))
});

const MarksValidate = joi.object({
  subject: joi.string().required(),
  marks: joi.string().required()
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(" ");
      const token = bearer[1];
      req.token = token;
      next();
  }
  else {
      res.send({
          msg:'invalid token'
      })
  }
}

module.exports = {
  dataValidator,
  MarksValidate,
  verifyToken
};
