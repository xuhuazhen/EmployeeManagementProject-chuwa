import { generateToken } from '../utils/generateToken.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { SignupToken } from '../models/SignupToken.js';
import jwt from 'jsonwebtoken'; 


export const get_signup = (req, res, next) => {
  const signupToken = req.params.signupToken;

  try {
    const decoded = jwt.verify(signupToken, process.env.ACCESS_TOKEN_SECRET);
    const email = decoded.email;
    return res.status(200).json({ isValid: true, email });
  } catch (error) {
    return res.status(200).json({ isValid: false });
  }
};

export const post_signup = catchAsync(async (req, res, next) => {
  const { username, email, password, signupToken } = req.body;

  const newUser = await User.create({
    username,
    email,
    password
  });
  
  SignupToken.markAsCompleted(email, signupToken);

  const token = generateToken(newUser._id, newUser.username, newUser.role);
  res.cookie('token', token, { httpOnly: true, maxAge: 10800000 });

  // Remove password from output
  newUser.password = undefined;

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

export const post_login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
 
  if (!username || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }
  let user = null;

  user = await User.findOne({ username })
    .populate('documents')
    .select('+password');

  if (!user) {
    return next(new AppError('Incorrect username', 401));
  }
  
  const isPwdCorrect = await user.correctPassword(user.password, password);
  if (!user || !isPwdCorrect) {
    return next(new AppError('Incorrect username or password', 401));
  }

  const token = generateToken(user._id, user.username, user.role);

  res.cookie('token', token, { httpOnly: true, maxAge: 10800000 });

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

export const get_logout = catchAsync(async (req, res, next) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() - 10 * 1000), // Set the cookie to expire in the past
    maxAge: 0, // Expires immediately
    httpOnly: true, // Accessible only by the web server
    path: '/',
  });
  res.status(200).json({ status: 'success' });
});

export const get_login = async (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  if (req.cookies.token) {
    try {
      const decoded = jwt.verify(
        req.cookies.token,
        process.env.ACCESS_TOKEN_SECRET
      );

      const currentUser = await User.findById(decoded.id);

      if (!currentUser) {
        return res.status(200).json({ isLogin: false });
      }
      console.log('pass')
      //   currentUser.password = undefined;
      // THERE IS A LOGGED IN USER
      return res.status(200).json({
        isLogin: true,
        userId: decoded.id,
        username: decoded.username,
        role: decoded.role,
        nextStep: currentUser.nextStep,
      });
    } catch (err) {
      return res.status(200).json({ isLogin: false });
    }
  } else {
    return res.status(200).json({ isLogin: false });
  }
};
