const mongoose = require("mongoose");

const IDDocumentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["CMND", "CCCD", "Passport"],
    required: true,
  },
  idNumber: { type: String, required: true, unique: true },
  issuedDate: { type: Date, required: true },
  expiryDate: { type: Date },
  issuedPlace: { type: String, required: true },
  countryIssued: { type: String },
  hasChip: { type: Boolean },
  notes: { type: String },
});

module.exports = mongoose.model("IDDocument", IDDocumentSchema);
