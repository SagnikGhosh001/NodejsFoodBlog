const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "gmail",
  port: 587,
  secure: false, 
  auth: {
    user: "sagnikghosh904@gmail.com",
    pass: "lgpbkwdgtinijdzc",
  },
});

// Function to send an email
async function sendMail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: '"Sagnik" <sagnikghosh904@gmail.com>',
      to: to, 
      subject: subject,
      text: text, 
      html: html, 
    });

    console.log("Message sent: %s", info.messageId);
  
  } catch (error) {
    console.error("Error sending email:", error);
  }
}


