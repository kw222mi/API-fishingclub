/**
 * Module for the FishingClubController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

// import createError from 'http-errors'

/**
 * Encapsulates a controller.
 */
export class FishingClubController {
  /**
   * Validate indata.
   *
   * @param req
   * @param res
   * @param next
   */
  validateIndata (req, res, next) {
    console.log('not implemented')
  }

  /**
   * Get a user.
   *
   * @param req
   * @param res
   * @param next
   */
  getUser (req, res, next) {
    try {
      res.setHeader('Content-Type', 'application/json')
      res.json({ username: 'Flavio' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create a new user.
   *
   * @param req
   * @param res
   * @param next
   */
  createUser (req, res, next) {
    res.send('Received a POST HTTP method')
  }
}
