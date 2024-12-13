import express from 'express'
import { userControllers } from './user.controllers'

const router = express.Router()

router.post("/create-admin",userControllers.createAdmin)

export const userRoutes = router
