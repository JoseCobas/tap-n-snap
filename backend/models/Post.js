const [fs, path] = [require('fs'), require('path')];
const { Schema, model } = require('mongoose');

const PostSchema = Schema({
  url: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: String,
  tags: [String]
})

// the whole image data is sent from frontend as the property url
// convert to only a file name and save photo in public/uploads
// (the mongoose save hook let us do changes before saving...)
PostSchema.pre('save', function (next) {
  let [type, base64] = this.url.split(',');
  let extension = type.split('/')[1].split(';')[0];
  let buffer = Buffer.from(base64, 'base64');
  let fileName = `${this.user}_${Date.now()}.${extension}`;
  let filePath = path.join(
    __dirname, '../', '../', 'public', 'uploads', fileName
  );
  this.url = fileName;
  fs.writeFile(filePath, buffer, next)
});

module.exports = model('Posts', PostSchema)
