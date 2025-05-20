import mongoose, { Schema, models, model } from 'mongoose';

const CaloriesEntrySchema = new Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  activity: { type: String, required: true },
  duration: { type: Number, required: true },
  calories: { type: Number, required: true },
}, { timestamps: true });

export default models.CaloriesEntry || model('CaloriesEntry', CaloriesEntrySchema); 