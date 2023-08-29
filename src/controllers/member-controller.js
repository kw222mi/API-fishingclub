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
   * Get all members.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getMember (req, res, next) {
    try {
      const members = await Member.find()
      res.setHeader('Content-Type', 'application/json')
      res.json(members)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get a member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getMemberById (req, res, next) {
    try {
      const member = await Member.findById(req.params.id)
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Last-Modified', `${member.updatedAt}`)
      res.json(member)
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
  async createMember (req, res, next) {
    try {
      const newMember = new Member({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      })
      await newMember.save()
      console.log('saved' + newMember)
      console.log(' member id ' + newMember._id)
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Location', `http://localhost:8080/fishing-club/member${newMember._id}`)

      res
        .status(201)
        .json(newMember)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Change a member document.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async changeMember (req, res, next) {
    try {
      const member = await Member.findById(req.params.id)
      console.log(req.body)

      if (member) {
        member.firstName = req.body.firstName
        member.lastName = req.body.lastName
        member.email = req.body.email

        await member.save()
        res
          .status(200)
          .json(member)
      } else {
        console.log('member not found')
      }
    } catch (error) {

    }
  }

  /**
   * Delete a cattch document.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async deleteMember (req, res, next) {
    await Member.findByIdAndDelete(req.params.id)
    res.send(
        `DELETE HTTP method on member/${req.params.id} resource`)
  }
}
