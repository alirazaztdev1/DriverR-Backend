import twilio from 'twilio';
import dotenv from 'dotenv';
import chalk from 'chalk';
dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Shahid's personal twilio account on trial
const sendOTP = (otp, phoneNumber) => {
  client.messages
    .create({
      body: `Your ${process.env.APP_NAME} OTP code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    })
    .then((message) =>
      console.log(
        chalk.green(
          `OTP CODE ${chalk.blue(`${otp}`)} SENT TO ${chalk.blue(
            `${phoneNumber}`
          )} VIA MESSAGE SID  ${chalk.blue(`${message.sid}`)}`
        )
      )
    )
    .catch((error) => console.log(chalk.red('TWILIO CONFIG ERROR: ', error)));
};

export default sendOTP;
