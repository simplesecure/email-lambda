const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const aws = require('aws-sdk');
// const transporter = nodemailer.createTransport({
//   SES: new aws.SES({
//     accessKeyId: '',
//     secretAccessKey: '',
//     apiVersion: "2010-12-01"
//   })
// })

const transporter = nodemailer.createTransport({
  host: "email-smtp.us-west-2.amazonaws.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "",
    pass: ""
  }
});

router.post('/', async (req, res) => {
  const { emails, template, subject, from } = req.body
  console.log(req.body)
  let emailString = ''
  if(emails.length > 50) {
    //Need to create groups and loop through since SES has a bulk send of 50
  } else {
    for(const email of emails) {
      emailString = emailString + email + ","
    }
    console.log(emailString.substring(0, emailString.length - 1))
    const mailOptions = {
      from,
      to: emailString,
      subject: subject,
      text: `Plain Text Goes Here`, 
      html: template.html
    }
    try { 
      const results = await transporter.sendMail(mailOptions);
      console.log("REULTS: ", JSON.stringify(results,0,2));
      res.status(200).send('success')
    } catch(e) {
      console.log("IT's MESSED UP: ")
      console.log(e)
      res.status(400).send(e)
    }
  }
})

module.exports = router;