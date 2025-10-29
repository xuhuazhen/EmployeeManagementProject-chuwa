import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { generateSignupToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import { SignupToken } from '../models/SignupToken.js';
import { getAll } from '../utils/handleFactory.js'; 

export const get_allProfiles = catchAsync(async (req, res, next) => {
  const profiles = await User.find()
    .collation({ locale: "en" })
    .sort({ "personalInfo.lastName": 1 });

  console.log("Profiles count:", profiles.length);

  if (!profiles) {
    return next(new AppError("No profiles found", 404));
  }
  res.status(200).json({ status: "success", data: profiles });
});  

export const post_sendEmail = catchAsync(async (req, res, next) => {
  const { email, fullName } = req.body;

  if (!email || !fullName) {
    return next(new AppError('Email and full name are required', 400));
  }
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

export const post_sendNotificationEmail = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  //TODO: check email exist

  const user = await User.findById(userId)
    .select('email nextStep personalInfo.firstName personalInfo.lastName')
    .exec();

  if (!user) {
    return next(new AppError('No user found by given userId', 404));
  }

  const type = user.nextStep.split('-')[0];
  const status = user.nextStep.split('-')[1];

  const fileMapping = {
    ead: 'Application',
    i983: 'EAD Document',
    i20: 'I-983 Document',
  };
  let message = '';
  switch (status) {
    case 'waiting':
      message = `Your ${fileMapping[type]} has been approved, please login to your account to submit your ${type} document.`;
      break;
    case 'reject':
      message = `Your ${type} document has been rejected, please login to your account to resubmit your ${type} Document.`;
      break;
    case 'pending':
      message = `Your ${type} document is pending, please wait for hr to approve your document.`;
      break;
    default:
      message = `All the documents you have submitted have been approved and no further steps are required! `;
  }

  const templateParams = {
    to: user.email,
    name: `${user.personalInfo?.firstName || ''} ${
      user.personalInfo?.lastName || ''
    }`,
    message,
  };

  const send = await sendEmail(templateParams, 'notify', next);

  if (send) {
    res.status(200).json({
      status: 'success',
      message,
    });
  } else {
    return next(new AppError('Failed send Email', 500));
  }
});
