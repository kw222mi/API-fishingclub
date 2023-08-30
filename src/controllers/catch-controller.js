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
// bimport axios from 'axios'

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
      res.setHeader('Content-Type', 'application/json')
      res.json(fishCatches)
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
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Last-Modified', `${fishCatch.updatedAt}`)
      res.json(fishCatch)
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

      /*
      // Get all users
      const users = await User.find()
      const webhookUrls = []
      for (const user of users) {
        // Get users with newCatch event
        if (user.eventName === 'newCatch') {
          webhookUrls.push(user.endpointUrl)
        }
      }
      // Send to all webhooks in the list
      for (const webhookUrl of webhookUrls) {
        const webhookResponse = await axios.post(webhookUrl, newCatch, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log('Webhook response:', webhookResponse.data)
      }
      */

      console.log('saved' + newCatch)
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Location', `http://localhost:8080/fishing-club/catch${newCatch._id}`)

      res
        .status(201)
        .json(newCatch)
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
      console.log(req.body)
      if (!fishCatch) {
        const notFoundError = createHttpError(404, 'Fish catch not found')
        return next(notFoundError)
      }
      Object.assign(fishCatch, req.body) // Update the document with data from req.body
      await fishCatch.save()
      res.json(fishCatch)
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
   */
  async addWebhookEvent (req, res, next) {
    try {
      const newWebhookEvent = new User({
        eventName: req.body.eventName,
        endpointUrl: req.body.endpointUrl
      })
      await newWebhookEvent.save()
      console.log('saved' + newWebhookEvent)
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Location', `http://localhost:8080/fishing-club/addWebhookEvent${newWebhookEvent._id}`)

      res
        .status(201)
        .json(newWebhookEvent)
    } catch (error) {
      console.error('Error:', error)
      const httpError = createHttpError(500, 'Internal server error')
      next(httpError)
    }
  }

  /**
   * Returns the links to include in fishCatch response.
   *
   * @param {string} fishCatchId - the id of the fishCatch
   * @param {string} memberId - the id of the user
   * @returns {Array} links
   */
  getFishCatchByIdLinks = (fishCatchId, memberId) => {
    return [
      {
        _links: {
          self: {
            href: `/catch/${fishCatchId}`
          },
          update: {
            href: `/catch/${fishCatchId}`,
            method: 'PUT'
          },
          delete: {
            href: `/catch/${fishCatchId}`,
            method: 'DELETE'
          },
          related: {
            href: `/member/${memberId}`
          }
        }
      }
    ]
  }
}
