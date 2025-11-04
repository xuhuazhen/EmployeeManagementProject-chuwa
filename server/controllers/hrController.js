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

// hr/history
export const get_tokenHistory = getAll(SignupToken);

export const post_sendNotificationEmail = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  console.log('sent to' , userId)
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
    ead: "OPT Document",
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

  //filterout all those who has not regitered (havent use the token for registration yet)
  conditions.push({ nextStep: { $ne: "application-waiting" } });

  //Filter all those employees who has submitted the application but has not been approved by all F1 files
  if (inProgressIncomplete === "true") {
    conditions.push({
      nextStep: { $nin: ["all-done", "application-waiting"] },
    });
  }

  // visa filter (used for visa page -ALL)
  if (visa === "F1") {
    conditions.push({ "employment.isF1": true });
  }
  // filter by application status (used in Onboarding Application Review)
  if (status)
    conditions.push({ "application.status": { $in: status.split(",") } });

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
  const { userId, status, feedback } = req.body;

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
  const user = await User.findById(userId);
  console.log('updated user-doc:', user);
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

// /hr/application
export const put_application = catchAsync(async (req, res, next) => { 
  const userId = req.params.id; 

  if (!req.body.action) {
    return next(new AppError('Invalid request, missing action', 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('No user found for the given user ID', 404));
  }

  const nextStep = user.nextStep;

  console.log(nextStep)
  if (nextStep === 'application-waiting') {
    return next(
      new AppError('No application found, User has not submit application', 404)
    );
  }
  
  let newApplicationStatus = req.body.action.toLowerCase();

  let newNextStep = nextStep;
  
  const profileDoc = user.documents.find((doc) => doc.tag === 'opt-receipt');

  switch (newApplicationStatus) {
    case 'approved':
      if (profileDoc) {
        profileDoc.status = 'approved';
        await profileDoc.save(); // 更新 Document 模型里的那条记录
      }

      if (user.employment.isF1 || user.employment.visaTitle === 'F1'  ) {
        newNextStep = 'ead-waiting';
      } else {
        newNextStep = 'all-done';
      }
 
      break;
    case 'rejected':
      if (profileDoc) {
        profileDoc.status = 'rejected';
        await profileDoc.save(); // 更新 Document 模型里的那条记录
      }
      newNextStep = 'application-reject'; 
      break;
    default:
      return new AppError(
        'invalid action, action can be only reject or approve',
        400
      );
  }

  user.application = {
    status: newApplicationStatus,
    feedback: req.body.feedback,
  };

  user.nextStep = newNextStep;

  await user.save();

  res.status(201).json({
    status: 'success',
    data: {
      nextStep: newNextStep,
      applicationStatus: newApplicationStatus
    }
  });
});