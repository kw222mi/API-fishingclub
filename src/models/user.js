/**
 * Mongoose model User.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const userSchema = new mongoose.Schema({
  eventName: {
    type: String,
    trim: true,
    required: true
  },

  endpointUrl: {
    type: String,
    trim: true,
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

// Create a model using the schema.
export const User = mongoose.model('User', userSchema)
