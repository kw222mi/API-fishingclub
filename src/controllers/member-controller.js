/**
 * Module for the MemberController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

// import createError from 'http-errors'
import { Member } from '../models/member.js'

/**
 * Encapsulates a controller.
 */
export class MemberController {
  /**
   * Validate indata.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  validateIndata (req, res, next) {
    console.log('not implemented')
  }

  /**
   * Get a member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  getCatch (req, res, next) {
    try {
      res.setHeader('Content-Type', 'application/json')
      res.json({ username: 'Flavio' })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create a new member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createCatch (req, res, next) {
    try {
      const newCatch = new Member({
        memberId: req.body.memberId,
        memberName: req.body.memberName,
        lakeName: req.body.lakeName,
        cityName: req.body.cityName,
        species: req.body.species,
        coordinates: req.body.coordinates,
        weight: req.body.weight,
        length: req.body.length,
        image: req.body.image
      })
      await newCatch.save()
      console.log('saved' + newCatch)
      console.log(' catch id ' + newCatch._id)
      res.setHeader('Content-Type', 'application/json',
        'Location', `http://localhost:8080/fishing-club/catch${newCatch._id}`)

      res
        .status(201)
        .json(newCatch)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Change a catch document.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  changeCatch (req, res, next) {
    res.send(
        `PUT HTTP method on catch/${req.params.id} resource`)
  }

  /**
   * Delete a cattch document.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  deleteCatch (req, res, next) {
    res.send(
        `DELETE HTTP method on catch/${req.params.id} resource`)
  }
}
