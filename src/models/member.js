/**
 * Mongoose model Member.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import validator from 'validator'

const { isEmail } = validator

// Create a schema.
const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxLength: [256, 'The firstName must be of maximum length 256 characters.'],
    trim: true,
    minlength: [1, 'The firstname must be of minimum length 1 characters.'],
    required: [true, 'FirstName is required.']
  },

  lastName: {
    type: String,
    maxLength: [256, 'The lastName must be of maximum length 256 characters.'],
    trim: true,
    minlength: [1, 'The lastName must be of minimum length 1 characters.'],
    required: [true, 'lastName is required.']
  },
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    maxLength: [254, 'The email must be of maximum length 256 characters.'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Please provide a valid email address.']
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

memberSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

memberSchema.pre('remove', function (next) {
  this.model('Catch').deleteMany({ member: this._id }, next)
})

// Create a model using the schema.
export const Member = mongoose.model('Member', memberSchema)
