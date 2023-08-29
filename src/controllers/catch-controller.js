/**
 * Module for the CatchController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

// import createError from 'http-errors'
import { Catch } from '../models/catch.js'
import { User } from '../models/user.js'
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
      next(error)
    }
  }

  /**
   * Get a catch.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getCatchById (req, res, next) {
    try {
      const fishCatch = await Catch.findById(req.params.id)
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Last-Modified', `${fishCatch.updatedAt}`)
      res.json(fishCatch)
    } catch (error) {
      next(error)
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

      const users = await User.find()
      let webhookUrl = ''
      for (let i = 0; i < users.length; i++) {
        if (users[i].eventName === 'newCatch') { webhookUrl = users[i].endpointUrl }

        if (webhookUrl != null && webhookUrl.length > 0) {
        // webhook response
        /*
          const result = await axios.post(webhookUrl, newCatch, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          console.log(result)
          */
          console.log(webhookUrl)
        }
      }

      console.log('saved' + newCatch)
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Content-Location', `http://localhost:8080/fishing-club/catch${newCatch._id}`)

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
  async changeCatch (req, res, next) {
    try {
      const fishCatch = await Catch.findById(req.params.id)
      console.log(req.body.lakeName)
      console.log(req.body)

      if (fishCatch) {
        fishCatch.member = req.body.memberId
        fishCatch.lakeName = req.body.lakeName
        fishCatch.cityName = req.body.cityName
        fishCatch.species = req.body.species
        fishCatch.coordinates = req.body.coordinates
        fishCatch.weight = req.body.weight
        fishCatch.length = req.body.length
        fishCatch.image = req.body.image

        await fishCatch.save()
        res.send('fishLake updated')
      } else {
        console.log('catch not found')
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
  async deleteCatch (req, res, next) {
    await Catch.findByIdAndDelete(req.params.id)
    res.send(
        `DELETE HTTP method on catch/${req.params.id} resource`)
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
      next(error)
    }
  }
}
