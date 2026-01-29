import mongoose from "mongoose";
import bcrypt from "bcryptjs"; // You need to install this: npm install bcryptjs

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  { timestamps: true }
);

// 🔐 ENCRYPTION: This runs automatically before the user is saved to MongoDB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // ⚠️ This line is CRITICAL
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);