import mongoose from "mongoose";

const emailConfigSchema = new mongoose.Schema({
  domain: { type: String, required: true, unique: true }
});

const EmailConfig = mongoose.model("EmailConfig", emailConfigSchema);

export default EmailConfig;
