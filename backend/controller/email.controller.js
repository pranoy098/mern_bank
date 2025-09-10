require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
  const { email, password } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
  });

  const emailTemplate = `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Account Details</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    
    <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" style="height: 100vh; width: 100%; text-align: center; vertical-align: middle;">
      <tr>
        <td align="center" valign="middle">
          
          <table cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); font-family: Arial, sans-serif; margin: auto;">
            
            <tr>
              <td align="center" style="padding: 20px 0;">
                <img src="https://www.justforcode.in/images/logo.jpg" alt="Company Logo" width="120" style="display: block;">
              </td>
            </tr>
            
            <tr>
              <td align="center" style="padding: 10px 0; background-color: #007BFF; color: #ffffff; font-size: 22px; font-weight: bold;">
                JFC Corporative Bank
              </td>
            </tr>
            
            <tr>
              <td style="padding: 20px;">
                <h2 style="font-size: 20px; margin-bottom: 15px; color: #333;">Welcome to Our Platform!</h2>
                <p style="font-size: 16px; color: #555;">
                  Here are your login credentials:
                </p>
                <table cellpadding="10" cellspacing="0" width="100%" style="margin-top: 10px; border: 1px solid #ddd;">
                  <tr style="background-color: #f9f9f9;">
                    <td style="font-weight: bold; width: 30%;">Username:</td>
                    <td>${email}</td>
                  </tr>
                  <tr style="background-color: #f9f9f9;">
                    <td style="font-weight: bold;">Password:</td>
                    <td>${password}</td>
                  </tr>
                </table>
                <p style="margin-top: 20px; font-size: 14px; color: #888;">
                  Please keep this information secure and do not share it with anyone.
                </p>
                <p style="margin-top: 30px; font-size: 16px;">
                  Best regards,<br><br>
                  <strong>Just For Code</strong>
                </p>
              </td>
            </tr>
            
            <tr>
              <td align="center" style="padding: 15px; background-color: #f1f1f1; font-size: 12px; color: #666;">
                &copy; 2025 JFC Corporative Bank . All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;

  const mailOption = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "Bank Authentication Details",
    html: emailTemplate,
  };

  transporter.sendMail(mailOption, (err, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error sending email", emailSend: false });
    }
    res.status(200).json({ message: "Email sent", emailSend: true });
  });
};

module.exports = {
  sendEmail,
};
