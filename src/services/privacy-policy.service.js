import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();

const view = async (req) => {
  try {
    // const { userId } = req.body;
    // let body = { ...req };
    // const user = await userService.findById(userId);
    // if (user && user.isVerified) {
    //   const profileExist = await findByUserId(user.id);
    //   if (profileExist) {
    //     await Driver.updateOne(
    //       { userId: mongoose.Types.ObjectId(userId) },
    //       req.body
    //     );
    //   } else {
    //     // todo.. update and include image upload functionality
    //     await Driver.create(req.body);
    //   }
    //   const data = await findByUserId(user.id);
    return {
      status: true,
      data: 'This is sample privacy policy',
      message: `Privacy policy`,
    };
    // }
  } catch (error) {
    console.log(chalk.red('Error: ' + error));
    return {
      status: false,
      message: error,
    };
  }
};

export { view };
