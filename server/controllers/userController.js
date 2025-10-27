import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

export const get_profile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});
