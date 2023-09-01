/**
 * API version 1 routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'
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
  } catch (error) {
    const httpError = createHttpError(401, 'Unauthorized')
    next(httpError)
  }
}

// ------------------------------------------------------------------------------
//  Routes
// ------------------------------------------------------------------------------

// GET member
router.get('/',
  authenticateJWT,
  (req, res, next) => controller.getMember(req, res, next)
)

// GET member by id
router.get('/:id',
  authenticateJWT,
  (req, res, next) => controller.getMemberById(req, res, next)
)

// POST member
router.post('/',
  authenticateJWT,
  (req, res, next) => controller.createMember(req, res, next, req.user)
)

router.put('/:id',
  authenticateJWT,
  (req, res, next) => controller.changeMember(req, res, next, req.user)
)

router.delete('/:id',
  authenticateJWT,
  (req, res, next) => controller.deleteMember(req, res, next, req.user)
)
