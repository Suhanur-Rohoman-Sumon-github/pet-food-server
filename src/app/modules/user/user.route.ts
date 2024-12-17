import express from 'express'
import { userControllers } from './user.controllers'

const router = express.Router()

router.post('/create-admin', userControllers.createAdmin)
router.post('/create-vendor', userControllers.createVendor)
router.get('/', userControllers.getAllUser)
router.patch('/block-user/:userId', userControllers.makeUserBlock)
router.delete('/delete-user/:userId', userControllers.deleteUser)

export const userRoutes = router
