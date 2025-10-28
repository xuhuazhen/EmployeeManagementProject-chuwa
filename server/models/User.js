import mongoose from "mongoose";
import * as argon2 from "argon2";

const Schema = mongoose.Schema;

const PersonalInfoSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    middleName: String,
    preferredName: String,
    ssn: String,
    dateOfBirth: Date,
    gender: String,
  },
  { _id: false }
);
const AddressSchema = new Schema(
  {
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
  },
  { _id: false }
);

const ContactInfoSchema = new Schema(
  {
    cellPhoneNumber: String,
    workPhoneNumber: String,
  },
  { _id: false }
);

const EmploymentSchema = new Schema(
  {
    visaTitle: String,
    startDate: Date,
    endDate: Date,
    isF1: Boolean,
  },
  { _id: false }
);

const ContactsSchema = new Schema({
  firstName: String,
  lastName: String,
  middleName: String,
  phone: String,
  email: String,
  relationship: String,
});

const ApplicationSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["waiting", "pending", "approved", "rejected"],
      default: "waiting",
      required: true,
    },
    feedback: String,
  },
  { _id: false }
);

const DocumentSchema = new Schema(
  {
    url: String,
    title: String,
    tag: {
      type: String,
      enum: [
        "profile-picture",
        "driver-license",
        "opt-receipt",
        "ead",
        "i983",
        "i20",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
    },
    feedback: String,
  },
  { versionKey: false }
);

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["employee", "hr"],
    default: "employee",
    required: true,
  },
  nextStep: {
    type: String,
    enum: [
      "application-waiting",
      "application-pending",
      "application-reject",
      "ead-waiting",
      "ead-pending",
      "ead-reject",
      "i20-waiting",
      "i20-pending",
      "i20-reject",
      "i983-waiting",
      "i983-pending",
      "i983-reject",
      "all-done",
    ],
    default: "application-waiting",
    required: true,
  },
  personalInfo: PersonalInfoSchema,
  address: AddressSchema,
  contactInfo: ContactInfoSchema,
  employment: EmploymentSchema,
  reference: ContactsSchema,
  emergencyContact: [ContactsSchema],
  application: { type: ApplicationSchema, default: () => ({}) },
  documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await argon2.hash(this.password);
  next();
});

UserSchema.methods.correctPassword = async function (
  userPassword,
  candidatePassword
) {
  return await argon2.verify(userPassword, candidatePassword);
};

export const User = mongoose.model("User", UserSchema, "user");
export const Document = mongoose.model("Document", DocumentSchema, "document");
