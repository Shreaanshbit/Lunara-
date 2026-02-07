const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const {
  addCycle,
  getCycles,
  getCurrentCyclePhase,
  deleteCycle
} = require('../controllers/cycleController')

const router = express.Router()

router.use(authMiddleware)

router.post('/', addCycle)
router.get('/', getCycles)
router.get('/phase/current', getCurrentCyclePhase)
router.delete('/:id', deleteCycle)
router.get('/insight/current', getCurrentCycleInsight)

module.exports = router