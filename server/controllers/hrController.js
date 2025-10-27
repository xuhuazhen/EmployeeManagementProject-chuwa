import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { generateSignupToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import { SignupToken } from '../models/SignupToken.js';
import { getAll } from '../utils/handleFactory.js';
import { User } from '../models/User.js';

export const post_sendEmail = catchAsync(async (req, res, next) => {
  const { email, fullName } = req.body;

  //check email exist
  const user = await User.findOne({ email });
  if (user) return next(new AppError('Email already exist in system'));

  // Generate a unique token
  const token = generateSignupToken(email);

  // Send email with signup link
  const templateParams = {
    to: email,
    name: fullName,
    link: `http://localhost:5173/signup/${token}`,
  };
  console.log(templateParams)

  const send = await sendEmail(templateParams, 'signup', next);

  if (send) {
    let history = await SignupToken.findOne({ email });
    if (history) {
      await history.updateOne({ token });
    } else {
      await SignupToken.create({ email, token, personName: fullName });
    }
    history = await SignupToken.findOne({ email });

    res.status(200).json({
      status: 'success',
      message: 'email send succeed',
      data: history,
    });
  } else {
    return next(new AppError('Failed send Email', 500));
  }
});

export const get_tokenHistory = getAll(SignupToken);

