/**
 * Mongoose model User.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import validator from 'validator'

const { isEmail } = validator

// Create a schema.
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minLength: [1, 'The firstName must be of minimum length 1 characters.'],
    maxLength: [256, 'The firstName must be of maximum length 256 characters.'],
    required: [true, 'First name is required.'],
    trim: true
  },
  lastName: {
    type: String,
    minLength: [1, 'The lastName must be of minimum length 1 characters.'],
    maxLength: [256, 'The lastName must be of maximum length 256 characters.'],
    required: [true, 'Last name is required.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    maxLength: [254, 'The email must be of maximum length 256 characters.'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [isEmail, 'Please provide a valid email address.']
  },
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    // - A valid username should start with an alphabet so, [A-Za-z].
    // - All other characters can be alphabets, numbers or an underscore so, [A-Za-z0-9_-].
    // - Since length constraint is 3-256 and we had already fixed the first character, so we give {2, 255}.
    // - We use ^ and $ to specify the beginning and end of matching.
    match: [/^[A-Za-z][A-Za-z0-9_-]{2,255}$/, 'Please provide a valid username.']
  },
  password: {
    type: String,
    minLength: [10, 'The password must be of minimum length 10 characters.'],
    maxLength: [256, 'The password must be of maximum length 256 characters.'],
    required: [true, 'Password is required.'],
    writeOnly: true
  },
  webhookDetails: [{
    eventName: String,
    endpointUrl: String
  }]
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

// Salts and hashes password before save.
userSchema.pre('save', async function () {
  try {
    this.password = await bcrypt.hash(this.password, 10)
  } catch (error) {
    throw new Error('Password hashing failed.')
  }
})

/**
 * Authenticates a user.
 *
 * @param {string} username - ...
 * @param {string} password - ...
 * @returns {Promise<User>} ...
 */
userSchema.statics.authenticate = async function (username, password) {
  try {
    const user = await this.findOne({ username })
    if (!user) {
      throw new Error('User not found.')
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials.')
    }
    return user
  } catch (error) {
    throw new Error('Authentication failed.')
  }
}

// Create a model using the schema.
export const User = mongoose.model('User', userSchema)
