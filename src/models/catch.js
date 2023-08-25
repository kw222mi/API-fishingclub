/**
 * Mongoose model Catch.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lakeName: {
    type: String,
    maxLength: [256, 'The lakename must be of maximum length 256 characters.'],
    trim: true,
    minlength: [1, 'The lakename must be of minimum length 1 characters.']
  },

  cityName: {
    type: String,
    required: [true, 'cityname is required.'],
    maxLength: [256, 'The cityname must be of maximum length 256 characters.'],
    trim: true,
    minlength: [1, 'The cityname must be of minimum length 1 characters.']
  },
  species: {
    type: String,
    trim: true
  },
  coordinates: {
    type: [Number, Number],
    index: '2d'
  },
  weight: {
    type: Number
  },
  length: {
    type: Number
  },
  image: {
    type: String
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
export const Catch = mongoose.model('Catch', schema)
