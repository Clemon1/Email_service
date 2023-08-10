import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(express.json());

// Email Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.Email,
    pass: process.env.Password,
  },
});
// Verify the transporter
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.get("/", (req, res) => {
  res.send("Email server");
});

app.post("/send", async (req, res) => {
  const { fullname, email, subject, message } = req.body;

  let mailMessage = {
    from: `<${email}>`, // sender address
    to: process.env.Email, // list of receivers
    subject: `${subject}`, // Subject line
    html: `
    <body>
    <b>You have a message from ${fullname}</b>
    <b> Email: ${email}</b>
     <p> ${message}</p>
    </body>`, // html body
  };
  const info = await transporter.sendMail(mailMessage);

  res.json(info);
});

app.listen(4000, () => {
  console.log("App listening on port 4000");
});
