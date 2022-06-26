const router = require('express').Router()
const { getUserData, postUserData } = require('../controllers/user')

router.post('/api/users', postUserData )
router.get('/', getUserData)

module.exports = router