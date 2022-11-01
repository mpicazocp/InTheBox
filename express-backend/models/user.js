const mongoose = require('mongoose');
// const mediaModel = require('./media');

const UserSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
          if (value.length < 8) {
            throw new Error('Invalid password, must be at least 8 characters.');
          } else if (value.length > 16) {
            // eslint-disable-next-line max-len
            throw new Error('Invalid password, must be at least 16 characters.');
          }
        },
      },
      media_list: [],
    },
    {collection: 'user_list'},
);

const User = mongoose.model('User', UserSchema);

module.exports = User;