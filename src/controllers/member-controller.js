/**
 * Module for the MemberController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import createHttpError from 'http-errors'
import { Member } from '../models/member.js'

/**
 * Encapsulates a controller.
 */
export class MemberController {
  /**
   * Get all members.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getMember (req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1 // Get the page from query param, default 1
      const perPage = parseInt(req.query.perPage) || 50 // Number of documents per page, default 50

      const totalMembers = await Member.countDocuments()
      const totalPages = Math.ceil(totalMembers / perPage)

      const members = await Member.find()
        .skip((page - 1) * perPage)
        .limit(perPage)

      const membersWithLinks = members.map((member) => {
        return {
          ...member._doc,
          _links: {
            self: {
              href: `/fishing-club/member/${member._id}`
            },
            update: {
              href: `/fishing-club/member/${member._id}`,
              method: 'PUT'
            },
            delete: {
              href: `/fishing-club/member/${member._id}`,
              method: 'DELETE'
            }
          }
        }
      })

      const response = {
        _links: {
          self: {
            href: '/fishing-club/member'
          },
          create: {
            href: '/fishing-club/member',
            method: 'POST'
          },
          update: {
            href: '/fishing-club/member',
            method: 'PUT'
          },
          delete: {
            href: '/fishing-club/member',
            method: 'DELETE'
          }
        },
        _embedded: {
          members: membersWithLinks
        },
        pagination: {
          currentPage: page,
          totalPages,
          perPage,
          totalMembers
        }
      }

      res
        .setHeader('Content-Type', 'application/json')
        .status(200)
        .json(response)
    } catch (error) {
      console.error('Database error:', error)
      const httpError = createHttpError(500, 'Internal server error')
      next(httpError)
    }
  }

  /**
   * Get a member.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {object} - error
   */
  async getMemberById (req, res, next) {
    try {
      const member = await Member.findById(req.params.id)
      if (!member) {
        const notFoundError = createHttpError(404, 'Member not found')
        return next(notFoundError)
      }
      const memberLinks = {
        ...member._doc,
        _links: {
          self: {
            href: `/fishing-club/member/${member._id}`
          },
          update: {
            href: `/fishing-club/member/${member._id}`,
            method: 'PUT'
          },
          delete: {
            href: `/fishing-club/member/${member._id}`,
            method: 'DELETE'
          },
          create: {
            href: '/fishing-club/member',
            method: 'POST'
          }
        }
      }
      res
        .setHeader('Content-Type', 'application/json')
        .setHeader('Last-Modified', `${member.updatedAt}`)
        .status(200)
        .json(memberLinks)
    } catch (error) {
      console.error('Database error:', error)
      const httpError = createHttpError(500, 'Internal server error')
      next(httpError)
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

      const memberLinks = {
        ...newMember._doc,
        _links: {
          self: {
            href: `/fishing-club/member/${newMember._id}`
          },
          read: {
            href: `/fishing-club/member/${newMember._id}`,
            method: 'GET'
          },
          update: {
            href: `/fishing-club/member/${newMember._id}`,
            method: 'PUT'
          },
          delete: {
            href: `/fishing-club/member/${newMember._id}`,
            method: 'DELETE'
          }
        }
      }

      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Location', `http://localhost:8080/fishing-club/member${newMember._id}`)

      res
        .status(201)
        .json(memberLinks)
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
   * @returns {object} - error
   */
  async changeMember (req, res, next) {
    try {
      const member = await Member.findById(req.params.id)
      if (!member) {
        const notFoundError = createHttpError(404, 'Member not found')
        return next(notFoundError)
      }

      Object.assign(member, req.body) // Update the document with data from req.body
      await member.save()

      const memberLinks = {
        ...member._doc,
        _links: {
          self: {
            href: `/fishing-club/member/${member._id}`
          },
          read: {
            href: `/fishing-club/member/${member._id}`,
            method: 'GET'
          },
          delete: {
            href: `/fishing-club/member/${member._id}`,
            method: 'DELETE'
          },
          create: {
            href: '/fishing-club/member',
            method: 'POST'
          }
        }
      }
      res.setHeader('Content-Type', 'application/json')
        .status(200)
        .json(memberLinks)
    } catch (error) {
      console.error('Error:', error)
      const httpError = createHttpError(500, 'Internal server error')
      next(httpError)
    }
  }

  /**
   * Delete a cattch document.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {object} - error
   */
  async deleteMember (req, res, next) {
    try {
      const deleteMember = await Member.findByIdAndDelete(req.params.id)

      if (!deleteMember) {
        const notFoundError = createHttpError(404, 'Member not found')
        return next(notFoundError)
      }
      res.status(204).send() // 204 No Content status if deleted successfully
    } catch (error) {
      console.error('Error:', error)
      const httpError = createHttpError(500, 'Internal server error')
      next(httpError)
    }
  }
}
