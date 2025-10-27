import validator from 'validator';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import { User } from '../models/User.js';
import { SignupToken } from '../models/SignupToken.js';

export const signupUserValidation = catchAsync(async (req, res, next) => {
  const { signupToken, username, password, email } = req.body;

  const history = await SignupToken.findOne({
    email,
    status: 'completed',
  }); 

  if (history) {
    return next(new AppError('User already signed up', 409));
  }

  const existUsername = await User.findOne({ username });
  if (existUsername) return next(new AppError('This username has been used', 401));


  const decoded = jwt.verify(signupToken, process.env.ACCESS_TOKEN_SECRET); 

  if (decoded.email !== email) {
    return next(new AppError('Email not same', 401));
  }

  if (
    !username ||
    !password ||
    !email ||
    validator.isEmpty(username) ||
    validator.isEmpty(password) ||
    validator.isEmpty(email)
  ) {
    return next(new AppError('Missing required fields!', 400));
  }

  if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    return next(new AppError('Password is too weak!', 400));
  }

  next();
});

export const loginUserValidation = (req, res, next) => {
  const { username, password } = req.body;
  if (
    !username ||
    !password ||
    validator.isEmpty(username) ||
    validator.isEmpty(password)
  ) {
    return next(new AppError('Missing required fields!', 400));
  }

  next();
};