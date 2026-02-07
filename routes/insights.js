const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getCycleSymptomInsights } = require('../controllers/insightController')

const router = express.Router()

router.get('/cycle', authMiddleware, getCycleSymptomInsights)

module.exports = router