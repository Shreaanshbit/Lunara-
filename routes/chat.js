const express = require('express')
const { chatWithLunara } = require('../controllers/chatController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, chatWithLunara)

module.exports = router