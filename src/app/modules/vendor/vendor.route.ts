import express from 'express'
import { VendorControllers } from './vendor.controllers'

const router = express.Router()
router.post('/', VendorControllers.createVendorInDB)

export const vendorRoutes = router
