// Generate OTP
// todo .. remove otp hardcoding after testing
const generateOTP = () => 111111; //Math.floor(100000 + Math.random() * 900000);

// Generate a unique jobId for a new job
function generateJobId() {
  const timestamp = Date.now().toString(36).toUpperCase(); // Convert current timestamp to base 36 string and uppercase
  let randomString = '';
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) {
    randomString += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  return timestamp + randomString;
}

function generateImageName(image) {
  let extArray = image.mimetype.split('/');
  let extension = extArray[extArray.length - 1];
  const name = image.fieldname + '-' + Date.now() + '.' + extension;
  return name;
}

export { generateOTP, generateJobId, generateImageName };
