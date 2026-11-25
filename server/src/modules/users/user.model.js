import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    passwordHash: {
      type: String,
      required: true,
      minlength: 60, // bcrypt hashes are ~60 chars
    },
    role: {
      type: String,
      enum: ["vendor", "customer"],
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    refreshTokenHash: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
