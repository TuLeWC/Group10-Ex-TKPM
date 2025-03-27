import mongoose from 'mongoose';

const statusTransitionConfigSchema = mongoose.Schema({
  fromStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentStatus',
    required: true,
  },
  toStatus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentStatus',
    required: true,
  },
});

const StatusTransitionConfig = mongoose.model(
  'StatusTransitionConfig',
  statusTransitionConfigSchema
);

export default StatusTransitionConfig;
