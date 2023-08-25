/**
 * API fishing club routes.
 *
 * @author Therese Weidenstedt
 * @version 1.0.0
 */

import express from 'express'
import { router as userRouter } from './user-router.js'
import { router as catchRouter } from './catch-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Welcome to the fishing club!' }))

router.use('/user', userRouter)
router.use('/catch', catchRouter)
