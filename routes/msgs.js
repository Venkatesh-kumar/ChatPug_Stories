const express = require('express')
const router = express.Router()

const MsgsController = require('../controllers/MsgsController')

router.get('/',MsgsController.index);
router.post('/addMsg',MsgsController.addMsg);
router.post('/userMsgs',MsgsController.getUserMsgs)
router.post('/deleteMsg',MsgsController.deleteMsg)
router.post('/deleteMsgType',MsgsController.deleteMsgType)

module.exports = router