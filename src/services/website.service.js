import { senEmailFromWebsite } from '../utilities/mail.utility.js';

const sendEmail = async (req) => {
  const { name, email, description } = req.body;

  try {
    if (name === '' || email == '' || description === '') {
      return { status: true, message: 'Please fill all fields' };
    }
    const msg = {
      // to: 'YOUR_EMAIL_ADDRESS', // Replace with the recipient email address
      to: process.env.WEBSITE_EMAIL_RECEIVER, // Replace with the recipient email address
      from: process.env.SENDGRID_FROM_EMAIL, // Replace with the sender email address
      subject: 'Test Email',
      html: `<h3>Email: ${email} </h3>
      <h3>Name: ${name}</h3>
      <p style="margin-bottom:30px">Description: ${description}</p>
      `,
    };
    await senEmailFromWebsite(msg);
    return { status: true, message: 'Send Successfully' };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

export { sendEmail };
