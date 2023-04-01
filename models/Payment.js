module.exports = (database) => {
  const { Schema, model } = require('mongoose');

const paymentSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  fee: Number,
  date: Date,
});
database.model('Payment', paymentSchema);
}
