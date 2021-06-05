const { Schema, model } = require('mongoose');

let MessageSchema = new Schema({
  text: { type: String, required: true },
  author: { type: Schema.Types.String, ref: 'User', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // author: { type: String, required: true },
  room: { type: String, required: true },
  sent: { type: Date, default: Date.now }
});

module.exports = model('Message', MessageSchema);
