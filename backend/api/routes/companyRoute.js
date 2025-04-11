const express = require('express')
const router = express.Router()
const {
    createCompany
} = require('../controllers/companyController')

router.post('/create', createCompany)

module.exports = router