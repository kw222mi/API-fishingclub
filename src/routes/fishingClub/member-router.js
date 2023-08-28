/**
 * API version 1 routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
// import jwt from 'jsonwebtoken'
// import createError from 'http-errors'
import { MemberController } from '../../controllers/member-controller.js'

export const router = express.Router()

const controller = new MemberController()

/**
 * Authenticates requests.
 *
 * If authentication is successful, `req.user`is populated and the
 * request is authorized to continue.
 * If authentication fails, an unauthorized response will be sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */

/*
const authenticateJWT = (req, res, next) => {
  try {
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.')
    }
    const verifyOptions = {
      algorithm: ['RS256']
    }
    // restore the formatting of the pem file
    const originalPublicKey = process.env.PUBLIC_KEY.replace(/\\n/g, '\n')

    const payload = jwt.verify(token, originalPublicKey, verifyOptions)
    req.user = {
      username: payload.sub,
      firstName: payload.given_name,
      lastName: payload.family_name,
      email: payload.email
    }

    next()
  } catch (err) {
    const error = createError(401)
    error.cause = err
    next(error)
  }
}
*/

// ------------------------------------------------------------------------------
//  Routes
// ------------------------------------------------------------------------------

/*
router.get('/user',
  authenticateJWT,
  (req, res, next) => controller.getUser(req, res, next)
)
*/

// GET member
router.get('/',
  (req, res, next) => controller.getMember(req, res, next)
)

// POST member
router.post('/',
  // authenticateJWT,
  // (req, res, next) => controller.validateIndata(req, res, next),
  (req, res, next) => controller.createMember(req, res, next, req.user)
)

router.put('/:id',
  (req, res, next) => controller.changeMember(req, res, next, req.user)
)

router.delete('/:id',
  (req, res, next) => controller.deleteMember(req, res, next, req.user)
)
