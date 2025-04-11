const express = require('express')
const router = express.Router()
const {
    createUser,
    signIn,
    verifySession,
    getUserData,
    getUsers
} = require('../controllers/userController.js')
const { protect } = require('../middleware/authMiddleware')

router.post('/create', createUser)
router.post('/signin', signIn)
router.get('/verify-session', protect, verifySession)
router.get('/getdata', protect, getUserData)

module.exports = router