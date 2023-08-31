/**
 * Module for the CatchController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

// import createError from 'http-errors'
import { Catch } from '../models/catch.js'
import { User } from '../models/user.js'
import createHttpError from 'http-errors'
import axios from 'axios'

/**
 * Encapsulates a controller.
 */
export class CatchController {
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
   * Get all catches.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getCatch (req, res, next) {
    try {
      const fishCatches = await Catch.find()
      const fishCatchsWithLinks = fishCatches.map((fishCatch) => { // Använd aliaset fishCatch istället för catch
        return {
          ...fishCatch._doc,
          _links: {
            self: {
              href: `/catch/${fishCatch._id}`
            },
            update: {
              href: `/catch/${fishCatch._id}`,
              method: 'PUT'
            },
            create: {
              href: `/catch/${fishCatch._id}`,
              method: 'POST'
            },
            delete: {
              href: `/catch/${fishCatch._id}`,
              method: 'DELETE'
            },
            related: {
              href: `/member/${fishCatch.member}`
            }
          }
        }
      })
      res.setHeader('Content-Type', 'application/json')
      res.json(fishCatchsWithLinks)
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
            href: `/catch/${fishCatch._id}`
          },
          update: {
            href: `/catch/${fishCatch._id}`,
            method: 'PUT'
          },
          delete: {
            href: `/catch/${fishCatch._id}`,
            method: 'DELETE'
          },
          create: {
            href: '/catch ',
            method: 'POST'
          },
          related: {
            href: `/member/${fishCatch.member}`
          }
        }
      }
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Last-Modified', `${fishCatch.updatedAt}`)
      res.json(fishCatchWithLinks)
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
            href: `/catch/${newCatch._id}`
          },
          update: {
            href: `/catch/${newCatch._id}`,
            method: 'PUT'
          },
          delete: {
            href: `/catch/${newCatch._id}`,
            method: 'DELETE'
          },
          create: {
            href: '/catch ',
            method: 'POST'
          },
          related: {
            href: `/member/${newCatch.member}`
          }
        }
      }
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Location', `http://localhost:8080/fishing-club/catch/${newCatch._id}`)

      res.status(201).json(newCatchWithLinks)
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
            href: `/catch/${fishCatch._id}`
          },
          delete: {
            href: `/catch/${fishCatch._id}`,
            method: 'DELETE'
          },
          create: {
            href: '/catch ',
            method: 'POST'
          },
          related: {
            href: `/member/${fishCatch.member}`
          }
        }
      }

      res.setHeader('Content-Type', 'application/json')
      res.json(updatedCatchWithLinks) // Return the updated document along with links
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
      const userId = req.params.userId

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

      console.log('saved', webhookEvent)
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
}
