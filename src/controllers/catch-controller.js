/**
 * Module for the CatchController.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

// import createError from 'http-errors'
import { Catch } from '../models/catch.js'

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
        fishCatch.memberId = req.body.memberId
        fishCatch.memberName = req.body.memberName
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
}
