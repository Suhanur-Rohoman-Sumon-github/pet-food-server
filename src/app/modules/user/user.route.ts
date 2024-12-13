import express from 'express'
import { userControllers } from './user.controllers'

const router = express.Router()

router.post("/create-admin",userControllers.createAdmin)
router.post("/create-vendor",userControllers.createVendor)
router.get("/",userControllers.getAllUser)

export const userRoutes = router
