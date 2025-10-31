import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { updateOne } from "../utils/handleFactory.js";

export const patch_profile = updateOne(User, 'documents');

// profile/:id
export const get_profile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('documents');

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// for visa status page /user/nextstep
export const get_nextStep = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const userId = req.user.userId;
  console.log(userId);
  const user = await User.findById(userId).populate('documents').exec();
  if (!user) {
    return next(new AppError('No user found for the given user ID', 404));
  }
  const nextStep = user.nextStep;
  let feedback = undefined;
  const [action, status] = nextStep.split('-');

  if (status === 'reject') {
    if (action === 'application') {
      feedback = user.application.feedback;
    } else {
      for (const doc of user.documents) {
        if (doc.tag === action) feedback = doc.feedback;
      }
    }
  }

  res.status(200).json({
    userId,
    nextStep: user.nextStep,
    feedback,
  });
});