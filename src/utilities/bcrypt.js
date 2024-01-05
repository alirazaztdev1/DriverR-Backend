import bcrypt from 'bcryptjs';
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const bcryptHash = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (er, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  });

// comment
const bcryptCompare = (hashedPassword, password) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

const hashPassword = async (password) => {
  if (!password) {
    return false;
  }
  const hash = await bcryptHash(password);

  return hash;
};

const comparePassword = async (password, hashedPassword) => {
  if (!password) {
    return false;
  }
  const isMatch = await bcryptCompare(hashedPassword, password);

  return isMatch;
};

export { hashPassword, comparePassword };
