/**
 * Mongoose model Catch.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  },
  lakeName: {
    type: String,
    maxLength: [256, 'The lake name must be at most 256 characters.'],
    trim: true,
    minlength: [1, 'The lake name must be at least 1 character.']
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
    index: '2d',
    validate: {
      /**
       * Function for validating of coordinates.
       *
       * @param {number} val - number to validate
       * @returns {boolean} - true if valid
       */
      validator: function (val) {
        return Array.isArray(val) && val.length === 2 && typeof val[0] === 'number' && typeof val[1] === 'number'
      },
      message: 'Coordinates should be an array of two numbers.'
    }
  },
  weight: {
    type: Number,
    min: [0, 'Weight must be a positive number.']
  },
  length: {
    type: Number,
    min: [0, 'Length must be a positive number.']
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
