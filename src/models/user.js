/**
 * Mongoose model User.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    maxLength: [256, 'The firstName must be of maximum length 256 characters.'],
    trim: true,
    minlength: [1, 'The firstname must be of minimum length 1 characters.']
  },

  lastName: {
    type: String,
    maxLength: [256, 'The lastName must be of maximum length 256 characters.'],
    trim: true,
    minlength: [1, 'The lastName must be of minimum length 1 characters.']
  },
  email: {
    type: Number,
    unique: true,
    required: true
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

userSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

userSchema.pre('remove', function (next) {
  this.model('Catch').deleteMany({ user: this._id }, next)
})

// Create a model using the schema.
export const Catch = mongoose.model('Catch', userSchema)
