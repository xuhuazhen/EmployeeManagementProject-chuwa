import { User } from "../models/User.js";
import { AppError } from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

//GET ALL THE EMPLOYEE PROFILES
export const get_allProfiles = catchAsync(async (req, res, next) => {
  const profiles = await User.find({ role: "employee" }) //only return user with role = employee
    .collation({ locale: "en" }) // case-insensitive sorting
    .sort({ "personalInfo.lastName": 1 })
    .populate("documents"); //sort alphabetically by last name
  console.log("Profiles count:", profiles.length);

  if (!profiles) {
    return next(new AppError("No profiles found", 404));
  }
  res
    .status(200)
    .json({ status: "success", results: profiles.length, data: profiles });
});
