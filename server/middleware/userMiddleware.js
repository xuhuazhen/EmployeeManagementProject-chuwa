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

export const authValidation = catchAsync(async (req, res, next) => {
  
  let token;
  
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  } 

  // decode token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // assign data inside the token to the request body so that we can directly access these data in the request object in the route handler functions
  req.user = {
    userId: decoded.id,
    username: decoded.username,
    role: decoded.role,
    nextStep: currentUser.nextStep,
  };

  next();

});