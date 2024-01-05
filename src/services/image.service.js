import awsS3 from '../config/aws-sdk.js';
import { generateImageName } from '../utilities/common.utility.js';

const upload = async (req, res) => {
  try {
    const image = req.file;
    const { previousImage } = req.query;

    const imageName = generateImageName(image);

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: imageName,
      Body: image.buffer,
    };

    if (!image) {
      return { status: false, message: 'Invalid image' };
    }

    if (previousImage) {
      let previousImageKey = previousImage?.split('/').pop();
      console.log(previousImageKey);
      const response = await awsS3
        .deleteObject({
          Bucket: process.env.BUCKET_NAME,
          Key: previousImageKey,
        })
        .promise();
      console.log({ response });

      const data = await awsS3.upload(params).promise();
      if (!data) {
        return {
          status: false,
          message: 'Something went wrong uploading image',
        };
      }
      return {
        status: true,
        mesage: 'Successfully uploaded image',
        data: data.Location,
      };
    }
    const data = await awsS3.upload(params).promise();
    if (!data) {
      return { status: false, message: 'Something went wrong uploading image' };
    }

    return {
      status: true,
      message: 'Successfully upload image',
      data: data.Location,
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

export { upload };
