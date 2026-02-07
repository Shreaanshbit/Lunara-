const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { confirmSymptoms } = require('../controllers/symptomController')

const router = express.Router()

router.use(authMiddleware)
router.post('/confirm', confirmSymptoms)

module.exports = router