import mongoose, { Schema } from "mongoose";
import IBulkUpload from "../../entities/IBulkUpload";

const bulkUploadSchema: Schema<IBulkUpload> = new mongoose.Schema(
  {
    recordsProcessed: { type: Number, required: true },
    totalErrors: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    session_id: { type: String, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const BulkUpload = mongoose.model<IBulkUpload>("BulkUpload", bulkUploadSchema);

export default BulkUpload;
