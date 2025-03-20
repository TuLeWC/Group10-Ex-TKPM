import mongoose from 'mongoose';

const idDocumentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['CMND', 'CCCD', 'Passport'],
    required: true,
  },
  idNumber: { type: String, required: true, unique: true },
  issuedDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  issuedPlace: { type: String, required: true },
  issuedCountry: { type: String },
  hasChip: { type: Boolean },
  notes: { type: String },
});

const IDDocument = mongoose.model('IDDocument', idDocumentSchema);

export default IDDocument;