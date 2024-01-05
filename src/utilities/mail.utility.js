import sgMail from '@sendgrid/mail';
import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const frontEndUrl = process.env.QS_FRONTEND_URL;

// website email

export const senEmailFromWebsite = async (msg) => {
  sgMail
    .send(msg)
    .then(() => {
      console.log('sent succuessfully');
      // res.status(200).json({ message: 'Email sent successfully' });
    })
    .catch((error) => {
      console.dir(error, { depth: Infinity });
      // res.status(500).json({ error: 'Failed to send email' });
    });
};

//
const sendEmail = async (recipient, passwordVerificationCode) => {
  const recipientEmail = recipient.includes('+')
    ? getTestingEmail(recipient)
    : recipient;
  console.log(chalk.yellow(recipientEmail));
  // Todo add live deployed link here
  let link = `https://admin.tirminator.com/reset-password?email=${recipientEmail}&passwordVerificationCode=${passwordVerificationCode}`;
  let emailSubject = 'DriverR';
  let htmlContent = ``; // todo .. edit for your own template and button
  const msg = {
    to: recipientEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: emailSubject,
    html: `<h3>Hi user, </h3>
    <p style="margin-bottom:30px">Please verify your email address for reset your password</p>
    <a style="background-color:#0F52BA;color:white;text-decoration:none;padding:10px 20px" href=${link} target="_blank">Verify Email</a>`,
  };
  let response = {
    status: true,
    message: 'send successfully',
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log(chalk.green('Email sent successfully'));
    })
    .catch((error) => {
      console.error(chalk.red(error));
      response = {
        status: false,
        message: error,
      };
    });

  return response;
};

const getTestingEmail = (recipient) => {
  const prefix = recipient.split('+')[0];
  const postfix = recipient.split('@')[1];
  return prefix + '@' + postfix;
};

const getEmailSubject = (template) => {
  if (template === 'email-verification') {
    return 'Quicksteps Email Address Verification';
  } else if (template === 'reset-password') {
    return 'Quicksteps Request to Reset Password';
  }
};

const getEmailBody = (template, token, recipient) => {
  let bodyData = { url: '', text: '', ending: '' };
  let urlType = 'email-verification';

  if (template === 'email-verification') {
    urlType = 'email-verification';
    bodyData.text =
      'We just need to verify your email address before you can access [Business Owner portal].';
    bodyData.ending =
      'The email verification link shall expire after 24 hours.';
  } else if (template === 'reset-password') {
    urlType = 'reset-password';
    bodyData.text =
      'There was a request to change your password!. If you did not make this request then please ignore this email.';
    bodyData.ending = 'The Password recovery link shall expire after 24 hours.';
  }
  const url = `${frontEndUrl}/auth/verify?type=${urlType}&email=${recipient}&token=${token}`;
  bodyData.url = url;
  console.log(url);
  return bodyData;
};

const getResponseMessage = (template) => {
  if (template === 'email-verification') {
    return 'Verification email sent successfully';
  } else if (template === 'reset-password') {
    return 'Reset password email sent successfully';
  }
};

const getAttachLinkEmail = (username, emailBody, subject) => {
  return `
    ${getEmailHeader()}
    ${getEmailSubjectContent(subject)}
    ${getEmailGreetings(username)}
    <p style="
      font-family: 'DM Sans';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: #46474F;
    ">
      ${emailBody.text}
      <div style="margin-bottom: 25px; margin-top: 22px;">
        <a href="${emailBody.url}" style="font-size: 16px; color: #2563eb">
          ${emailBody.url}
        </a>
      </div>
      <div style="
        font-family: 'DM Sans';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        color: #46474F;
      ">
        ${emailBody.ending} 
      </div>
    </p>
    ${getEmailThanksRegards()}
    ${getEmailFooter()}
  `;
};

const getWelcomeEmail = (name) => {
  return `
    ${getEmailHeader()}
    ${getEmailSubjectContent('Welcome to quicksteps!')}
    ${getEmailGreetings(name)}
    <p style="
      font-family: 'DM Sans';
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: #46474F;
    ">
      We are thrilled to welcome you to Quicksteps! As a new customer, we want to thank you for choosing us and let you know how much we appreciate your business.
      <br />
      At Quicksteps, we are committed to providing you with the best possible experience, whether you are managing finances, invoices, users or just browsing our website.   
      We want you to feel confident in your decision to choose Quicksteps, and we are here to answer any questions you may have. If you have any concerns or feedback, please do not hesitate to reach out to us.
      <br />
      Thank you again for choosing Quicksteps, and we look forward to serving you in the future!
    </p>
    ${getEmailThanksRegards()}
    ${getEmailFooter()}
  `;
};

const getEmailHeader = () => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="Description" content="Starter Template" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap');
          *{
            padding: 0px;
            margin: 0px;
            box-sizing: border-box;
          }
        </style>
      </head>
      <body style="margin-right: 45px">
        <div style="
          width: 100%;
          min-height: 170px;
          background: #2563eb;
          display: flex;
          justify-content: center;
          align-items: center;
        ">
          <img style="width: 250px;height: 35px;object-fit: contain;margin: auto;" src="https://i.ibb.co/yX3qdpC/download-2.png" />
        </div>
        <div style="
          background: #ffffff;
          border-radius: 4px;
          margin: -30px auto;
          padding: 40px;
          font-family: 'DM Sans';
          font-style: normal;
          font-weight: 400;
          color: #46474F;
        ">
  `;
};

const getEmailSubjectContent = (subject) => {
  return `
    <h4 style="
      font-size: 32px;
      line-height: 52px;
      text-align: center;
      font-weight: 700 !important;
      text-transform: capitalize;
      color: #121A26 !important;
      margin-bottom: 25px;
    ">
      ${subject}
    </h4>
  `;
};

const getEmailGreetings = (name) => {
  return `
    <div style="
      font-size: 16px;
      line-height: 24px;
      margin-bottom: 25px
    ">
      Hi ${name ?? 'there'},
    </div>
  `;
};

const getEmailThanksRegards = () => {
  return `
    <div style="
      margin-top: 29px;
      font-weight: 500;
      font-size: 16px;
      line-height: 25px;
    ">
      <div>
        Thanks,
      </div>
      <div style="margin-top: 11px">
        Quicksteps team
      </div>
    </div>
  `;
};

const getEmailFooter = () => {
  return `
    <section style="width: 100%;padding-top: 40px;">
      <div style="border-top: 1px solid #d6d6d6;position: absolute;left: 20px;right: 20px;"></div>
    </section>
    <table style="margin: 0 auto;">
      <tbody>
        <tr>
          <td style="margin: auto;width: 100%;">
            <img style="margin: auto;display: flex;justify-content: center;padding-top: 40px;" src="https://i.ibb.co/tJGRRDc/quciskteps-logo-blau.png" />
          </td>
        </tr>
        <tr style="display: flex;justify-content: center;padding-top: 30px;text-align: center;padding-left: 70px;">
          <td style="width: 20%;"><img src="https://i.ibb.co/86JZ6rC/Vector-1.png" /></td>
          <td style="width: 20%;"><img src="https://i.ibb.co/NpVqxtJ/Vector-2.png" /></td>
          <td style="width: 20%;"><img src="https://i.ibb.co/jfvr6Fy/Vector-3.png" /></td>
          <td style="width: 20%;"><img src="https://i.ibb.co/02b6qvN/Vector-4.png" /></td>
        </tr>
        <tr>
          <td style="padding-top: 32px;width: 100%;justify-content: center;gap: 25px;text-align: center;">
            <a
              href=""
              style="
                font-family: 'Inter';
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 19px;
                text-decoration: none;
                color: #0056d2;
                padding-right: 20px;
            ">
              Help
            </a>
            <span> | </span>
            <a
              href=""
              style="
                font-family: 'Inter';
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 19px;
                text-decoration: none;
                color: #0056d2;
                padding-left: 20px;
                padding-right: 20px;
            ">
              Privacy Notice
            </a>
            <span> | </span>
            <a
              href=""
              style="
                font-family: 'Inter';
                font-style: normal;
                font-weight: 400;
                font-size: 16px;
                line-height: 19px;
                text-decoration: none;
                color: #0056d2;
                padding-left: 20px;
                padding-right: 20px;
            ">
              Unsubscribe
            </a>
          </td>
        </tr>
        <tr>
          <td>
            <p style="
              font-family: 'Inter';
              font-style: normal;
              font-weight: 400;
              font-size: 12px;
              line-height: 22px;
              text-align: center;
              padding-top: 16px;
              color: #777777;
              max-width: 550px;
              margin: auto;
            ">
            © 2022 Quick Steps Inc. All rights reserved.
          </td>
        </tr>
      </tbody>
    </table>
    <style>
      @media (max-width: 500px) {
        body {
          padding-bottom: 0px !important;
        }
      }
    </style>  
  </body>
  </html>
  `;
};
export default sendEmail;
