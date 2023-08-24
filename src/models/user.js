/**
 * Mongoose model Resource.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  firstname: {
    type: String,
    required: [true, 'Firstname is required.'],
    maxLength: [256, 'The firstnam must be of maximum length 256 characters.'],
    trim: true,
    minlength: [1, 'The firstname must be of minimum length 1 characters.']
  },

  lastname: {
    type: String,
    required: [true, 'lastname is required.'],
    maxLength: [256, 'The lastname must be of maximum length 256 characters.'],
    trim: true,
    minlength: [1, 'The lastname must be of minimum length 1 characters.']
  },
  adress: {
    type: String,
    trim: true
  },
  telephoneNumber: {
    type: Number,
    trim: true
  },
  mail: {
    type: String,
    required: [true, 'mail is required.'],
    maxLength: [256, 'The mail must be of maximum length 256 characters.']
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true, // ensure virtual fields are serialized
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret.__v
      delete ret._id
    }
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const User = mongoose.model('User', schema)
