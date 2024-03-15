const nodemailer = require("nodemailer");


// Function to send email and update password
const sendEmail= async (user, subject,verificationLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: subject,
    html: `<div>
    <h4>Verification Link</h4>
    <p>Please click the link below to verify your email:</p>
    <p><a href="${verificationLink}">Click here to verify</a></p>
</div>`,
  };

  
    // Send the email
    const success = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + success.response);



};

module.exports = {
  sendEmail,

};
