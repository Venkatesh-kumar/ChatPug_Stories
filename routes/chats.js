const express = require('express')
const router = express.Router()

const ChatsController = require('../controllers/ChatsController')


router.post('/addChat',ChatsController.addChat);

module.exports = router