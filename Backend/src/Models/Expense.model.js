import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Expense can't be negative"],
  },
  category: {
    type: String,
    enum: ['Food', 'Travel','Autopay', 'Rent','Entertainment','Shopping','Health','Utilities', 'EMI', 'Other'],
    default: 'Other',
    required: true,
  },
  note: {
    type: String,
    maxlength: [100, 'Note is too long'],
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export const Expense = mongoose.model('Expense', expenseSchema);
