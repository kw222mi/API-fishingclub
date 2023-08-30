/**
 * Module for the AccountController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

// import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { User } from '../models/user.js'

/**
 * Encapsulates a controller.
 */
export class AccountController {
  /**
   * Authenticates a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      console.log(req.body.username, req.body.password)
      const user = await User.authenticate(req.body.username, req.body.password)
      console.log(user)
      const payload = {
        sub: user.username,
        given_name: user.firstName,
        family_name: user.lastName,
        email: user.email,
        x_permission_level: user.permissionLevel
      }

      const originalPrivateKey = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')

      // Create the access token with the shorter lifespan.
      const accessToken = jwt.sign(payload, originalPrivateKey, {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_LIFE
      })

      // // Create the refresh token with the longer lifespan.
      // -----------------------------------------------------------------
      // 👉👉👉 This is the place to create and handle the refresh token!
      //         Quite a lot of additional implementation is required!!!
      // -----------------------------------------------------------------
      // const refreshToken = ...

      res
        .status(201)
        .json({
          access_token: accessToken
          // refresh_token: refreshToken
        })
    } catch (error) {
      // Authentication failed.
      const err = createError(401, 'Access token invalid or not provided')
      err.cause = error

      next(err)
    }
  }

  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      const user = new User({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      })

      await user.save()

      res
        .status(201)
        .json({ id: user.id })
    } catch (error) {
      let err = error

      if (err.code === 11000) {
        // Duplicated keys.
        err = createError(409)
        err.cause = error
      } else if (error.name === 'ValidationError') {
        // Validation error(s).
        err = createError(400)
        err.cause = error
      }

      next(err)
    }
  }
}
