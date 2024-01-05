import mongoose from 'mongoose';
import chalk from 'chalk';

const startDB = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(chalk.yellow(' 👉 Driver-R database connected successfully!'));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
export default startDB;
