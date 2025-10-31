import { AppError } from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { generateSignupToken } from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { SignupToken } from "../models/SignupToken.js";
import { getAll } from "../utils/handleFactory.js";
import { User, Document } from "../models/User.js";

export const post_sendEmail = catchAsync(async (req, res, next) => {
  const { email, fullName } = req.body;

  if (!email || !fullName) {
    return next(new AppError("Email and full name are required", 400));
  }
  //check email exist
  const user = await User.findOne({ email });
  if (user) return next(new AppError("Email already exist in system"));

  // Generate a unique token
  const token = generateSignupToken(email);

  // Send email with signup link
  const templateParams = {
    to: email,
    name: fullName,
    link: `http://localhost:5173/signup/${token}`,
  };
  console.log(templateParams);

  const send = await sendEmail(templateParams, "signup", next);

  if (send) {
    let history = await SignupToken.findOne({ email });
    if (history) {
      await history.updateOne({ token });
    } else {
      await SignupToken.create({ email, token, personName: fullName });
    }
    history = await SignupToken.findOne({ email });

    res.status(200).json({
      status: "success",
      message: "email send succeed",
      data: history,
    });
  } else {
    return next(new AppError("Failed send Email", 500));
  }
});

export const get_tokenHistory = getAll(SignupToken);

export const post_sendNotificationEmail = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  //TODO: check email exist

  const user = await User.findById(userId)
    .select("email nextStep personalInfo.firstName personalInfo.lastName")
    .exec();

  if (!user) {
    return next(new AppError("No user found by given userId", 404));
  }

  const type = user.nextStep.split("-")[0];
  const status = user.nextStep.split("-")[1];

  const fileMapping = {
    ead: "Application",
    i983: "EAD Document",
    i20: "I-983 Document",
  };
  let message = "";
  switch (status) {
    case "waiting":
      message = `Your ${fileMapping[type]} has been approved, please login to your account to submit your ${type} document.`;
      break;
    case "reject":
      message = `Your ${type} document has been rejected, please login to your account to resubmit your ${type} Document.`;
      break;
    case "pending":
      message = `Your ${type} document is pending, please wait for hr to approve your document.`;
      break;
    default:
      message = `All the documents you have submitted have been approved and no further steps are required! `;
  }

  const templateParams = {
    to: user.email,
    name: `${user.personalInfo?.firstName || ""} ${
      user.personalInfo?.lastName || ""
    }`,
    message,
  };

  const send = await sendEmail(templateParams, "notify", next);

  if (send) {
    res.status(200).json({
      status: "success",
      message,
    });
  } else {
    return next(new AppError("Failed send Email", 500));
  }
});

//GET ALL THE EMPLOYEE PROFILES
export const get_employees = catchAsync(async (req, res) => {
  const { status, visa, inProgressIncomplete, search } = req.query;

  const conditions = [{ role: "employee" }];

  // nextStep filters
  if (status) conditions.push({ nextStep: { $in: status.split(",") } });

  if (inProgressIncomplete === "true")
    conditions.push({ nextStep: { $ne: "all-done" } });

  // visa filter
  if (visa === "F1") {
    conditions.push({ "employment.isF1": true });
  }

  // search filter (safe for missing personalInfo)
  if (search) {
    const regex = new RegExp(search, "i");
    conditions.push({
      $or: [
        { "personalInfo.firstName": { $regex: regex, $exists: true } },
        { "personalInfo.lastName": { $regex: regex, $exists: true } },
        { "personalInfo.middleName": { $regex: regex, $exists: true } },
        { "personalInfo.preferredName": { $regex: regex, $exists: true } },
      ],
    });
  }

  const employees = await User.find({ $and: conditions })
    .collation({ locale: "en" })
    .sort({ "personalInfo.lastName": 1 })
    .populate("documents")
    .lean();

  console.log("Filter used:", JSON.stringify({ $and: conditions }, null, 2));
  console.log("Found employees:", employees.length);

  res.status(200).json({
    status: "success",
    results: employees.length,
    data: employees,
  });
});

// Approve / Reject documen
export const updateDocumentStatus = catchAsync(async (req, res) => {
  const { docId } = req.params;
  const { status, feedback } = req.body;

  //Update the document itself
  const doc = await Document.findByIdAndUpdate(
    docId,
    { status, feedback },
    { new: true }
  );

  if (!doc) {
    return res
      .status(404)
      .json({ status: "error", message: "Document not found" });
  }

  console.log("Doc Status is updated");

  //Find which user this document belongs to
  const user = await User.findOne({ documents: docId });

  if (user) {
    let newNextStep = user.nextStep;

    //Update nextStep based on which document and its new status
    switch (doc.tag) {
      case "application":
        if (status === "approved") newNextStep = "ead-waiting";
        if (status === "rejected") newNextStep = "application-reject";
        break;

      case "ead":
        if (status === "approved") newNextStep = "i20-waiting";
        if (status === "rejected") newNextStep = "ead-reject";
        break;

      case "i20":
        if (status === "approved") newNextStep = "i983-waiting";
        if (status === "rejected") newNextStep = "i20-reject";
        break;

      case "i983":
        if (status === "approved") newNextStep = "all-done";
        if (status === "rejected") newNextStep = "i983-reject";
        break;

      default:
        break;
    }

    user.nextStep = newNextStep;
    await user.save();

    console.log(`User ${user.username}'s nextStep updated to: ${newNextStep}`);
  }

  //Return both document and updated user info
  res.status(200).json({
    status: "success",
    data: { doc, nextStep: user?.nextStep },
  });
});
