/**
 * API routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import { router as fishingClubRouter } from './fishingClub-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Welcome to the resource-service!' }))

router.use('/fishingClub', fishingClubRouter)
