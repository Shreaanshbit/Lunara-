const express = require('express')
const {
  createMoodLog,
  getMoodLogs,
  deleteMoodLog
} = require('../controllers/moodController')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(authMiddleware)

router.post('/', createMoodLog)
router.get('/', getMoodLogs)
router.delete('/:id', deleteMoodLog)

module.exports = router