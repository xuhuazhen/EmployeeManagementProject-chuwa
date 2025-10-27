import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

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
