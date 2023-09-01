/**
 * Module for the AccountController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'
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
      const user = await User.authenticate(req.body.username, req.body.password)

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

      res
        .status(200)
        .json({
          access_token: accessToken
        })
    } catch (error) {
      // Authentication failed.
      const httpError = createHttpError(401, 'Unathorized')
      next(httpError)
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
      const err = error

      if (err.code === 11000) {
        // Duplicated keys.
        const httpError = createHttpError(409, 'Conflict')
        next(httpError)
      } else if (error.name === 'ValidationError') {
        // Validation error(s).
        const httpError = createHttpError(400, 'Bad request')
        next(httpError)
      }

      next(err)
    }
  }
}
