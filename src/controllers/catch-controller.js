/**
 * Module for the CatchController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import { Catch } from '../models/catch.js'
import { User } from '../models/user.js'
import createHttpError from 'http-errors'
import axios from 'axios'

/**
 * Encapsulates a controller.
 */
export class CatchController {
  /**
   * Get all catches.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getCatch (req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1 // Get the page from query param, default 1
      const perPage = parseInt(req.query.perPage) || 50 // Number of results per page, default 50

      const totalCatches = await Catch.countDocuments()
      const totalPages = Math.ceil(totalCatches / perPage)

      const fishCatches = await Catch.find()
        .skip((page - 1) * perPage)
        .limit(perPage)

      const fishCatchsWithLinks = fishCatches.map((fishCatch) => {
        return {
          ...fishCatch._doc,
          _links: {
            self: {
              href: `/fishing-club/catch/${fishCatch._id}`
            },
            update: {
              href: `/fishing-club/catch/${fishCatch._id}`,
              method: 'PUT'
            },
            delete: {
              href: `/fishing-club/catch/${fishCatch._id}`,
              method: 'DELETE'
            },
            related: {
              href: `/fishing-club/member/${fishCatch.member}`
            }
          }
        }
      })

      const response = {
        _links: {
          self: {
            href: '/fishing-club/catch'
          },
          create: {
            href: '/fishing-club/catch',
            method: 'POST'
          },
          update: {
            href: '/fishing-club/catch',
            method: 'PUT'
          },
          delete: {
            href: '/fishing-club/catch',
            method: 'DELETE'
          }
        },
        _embedded: {
          catch: fishCatchsWithLinks
        },
        pagination: {
          currentPage: page,
          totalPages,
          perPage,
          totalCatches
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
   * Get a catch.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {object} error
   */
  async getCatchById (req, res, next) {
    try {
      const fishCatch = await Catch.findById(req.params.id)
      if (!fishCatch) {
        const notFoundError = createHttpError(404, 'Fish catch not found')
        return next(notFoundError)
      }
      const fishCatchWithLinks = {
        ...fishCatch._doc,
        _links: {
          self: {
            href: `/fishing-club/catch/${fishCatch._id}`
          },
          update: {
            href: `/fishing-club/catch/${fishCatch._id}`,
            method: 'PUT'
          },
          delete: {
            href: `/fishing-club/catch/${fishCatch._id}`,
            method: 'DELETE'
          },
          create: {
            href: '/fishing-club/catch',
            method: 'POST'
          },
          related: {
            href: `/fishing-club/member/${fishCatch.member}`
          }
        }
      }
      res
        .setHeader('Content-Type', 'application/json')
        .setHeader('Last-Modified', `${fishCatch.updatedAt}`)
        .status(200)
        .json(fishCatchWithLinks)
    } catch (error) {
      console.error('Database error:', error)
      const httpError = createHttpError(500, 'Internal server error')
      next(httpError)
    }
  }

  /**
   * Create a new catch.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async createCatch (req, res, next) {
    try {
      const newCatch = new Catch({
        member: req.body.memberId,
        lakeName: req.body.lakeName,
        cityName: req.body.cityName,
        species: req.body.species,
        coordinates: req.body.coordinates,
        weight: req.body.weight,
        length: req.body.length,
        image: req.body.image
      })

      await newCatch.save()

      // Get all the users from the database.
      const users = await User.find()

      const newCatchEventData = {
        eventName: 'newCatch',
        catchData: newCatch // Create an object with the catch data.
      }

      // Loop throw the users and send the webhook-data if the user is signed up.
      for (const user of users) {
        for (const webhookEvent of user.webhookDetails) {
          if (webhookEvent.eventName === 'newCatch') {
            const webhookUrl = webhookEvent.endpointUrl

            try {
              const webhookResponse = await axios.post(webhookUrl, newCatchEventData, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
              console.log('Webhook response:', webhookResponse.data)
            } catch (webhookError) {
              console.error('Webhook Error:', webhookError)
              // Continue the loop even if there is an error.
              // This way, the data will be sent to as many users as possible and the recipients
              // will be responsible for the error handling for their webhook requests.
              continue
            }
          }
        }
      }

      const newCatchWithLinks = {
        ...newCatch._doc,
        _links: {
          self: {
            href: `/fishing-club/catch/${newCatch._id}`
          },
          update: {
            href: `/fishing-club/catch/${newCatch._id}`,
            method: 'PUT'
          },
          delete: {
            href: `/fishing-club/catch/${newCatch._id}`,
            method: 'DELETE'
          },
          create: {
            href: '/fishing-club/catch ',
            method: 'POST'
          },
          related: {
            href: `/fishing-club/member/${newCatch.member}`
          }
        }
      }
      res
        .setHeader('Content-Type', 'application/json')
        .setHeader('Content-Location', `http://localhost:8080/fishing-club/catch/${newCatch._id}`)
        .status(201)
        .json(newCatchWithLinks)
    } catch (error) {
      console.error('Error:', error)
      const httpError = createHttpError(500, 'Internal server error')
      next(httpError)
    }
  }

  /**
   * Change a catch document.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {object} error
   */
  async changeCatch (req, res, next) {
    try {
      const fishCatch = await Catch.findById(req.params.id)

      if (!fishCatch) {
        const notFoundError = createHttpError(404, 'Fish catch not found')
        return next(notFoundError)
      }

      Object.assign(fishCatch, req.body) // Update the document with data from req.body
      await fishCatch.save()

      const updatedCatchWithLinks = {
        ...fishCatch._doc,
        _links: {
          self: {
            href: `/fishing-club/catch/${fishCatch._id}`
          },
          read: {
            href: `/fishing-club/catch/${fishCatch._id}`,
            method: 'GET'
          },
          delete: {
            href: `/fishing-club/catch/${fishCatch._id}`,
            method: 'DELETE'
          },
          create: {
            href: '/fishing-club/catch ',
            method: 'POST'
          },
          related: {
            href: `/fishing-club/member/${fishCatch.member}`
          }
        }
      }

      res
        .setHeader('Content-Type', 'application/json')
        .status(200)
        .json(updatedCatchWithLinks) // Return the updated document along with links
    } catch (error) {
      console.error('Error:', error)
      const httpError = createHttpError(500, 'Internal server error')
      next(httpError)
    }
  }

  /**
   * Delete a catch document.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {object} error
   */
  async deleteCatch (req, res, next) {
    try {
      const deletedCatch = await Catch.findByIdAndDelete(req.params.id)

      if (!deletedCatch) {
        const notFoundError = createHttpError(404, 'Fish catch not found')
        return next(notFoundError)
      }
      res.status(204).send() // 204 No Content status if deleted successfully
    } catch (error) {
      console.error('Error:', error)
      const httpError = createHttpError(500, 'Internal server error')
      next(httpError)
    }
  }

  /**
   * Add a user to a webhook event.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {object} httpError
   */
  async addWebhookEvent (req, res, next) {
    try {
      const userId = req.params.id

      const webhookEvent = {
        eventName: req.body.eventName,
        endpointUrl: req.body.endpointUrl
      }
      // Get the user by id
      const user = await User.findById(userId)

      if (!user) {
        const httpError = createHttpError(404, 'User not found')
        return next(httpError)
      }

      // Add the new webhook event in the users webhookDetails-array
      user.webhookDetails.push(webhookEvent)
      await user.save()

      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Location', `http://localhost:8080/fishing-club/addWebhookEvent/${userId}`)

      res
        .status(201)
        .json(webhookEvent)
    } catch (error) {
      console.error('Error:', error)
      const httpError = createHttpError(500, 'Internal server error')
      next(httpError)
    }
  }

  /**
   * Remove a webhook event.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {object} - error
   */
  async deleteWebhookEvent (req, res, next) {
    try {
      const userId = req.params.id
      const eventName = req.params.eventName

      // Update the user by removing the webhook for given event
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { webhookDetails: { eventName } } },
        { new: true } // Return the updated dokument
      )

      if (!updatedUser) {
        const httpError = createHttpError(404, 'User not found')
        return next(httpError)
      }

      res.status(204).send()
    } catch (error) {
      console.error('Error:', error)
      const httpError = createHttpError(500, 'Internal server error')
      next(httpError)
    }
  }
}
