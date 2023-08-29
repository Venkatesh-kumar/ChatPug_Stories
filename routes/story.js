const express = require('express')
const router = express.Router()

const StoryController = require('../controllers/StoryController')

router.get('/',StoryController.index);
router.post('/addStory',StoryController.addStory);
router.post('/userStories',StoryController.getUserStories)

module.exports = router