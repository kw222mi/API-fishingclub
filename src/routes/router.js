/**
 * API routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import { router as fishingClubRouter } from './fishingClub/fishingClub-router.js'
import { router as accountRouter } from './account-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Welcome!' }))

router.use('/fishing-club', fishingClubRouter)
router.use('/', accountRouter)
