const express = require('express');
const router = express.Router();
const Message = require('../../models/Message');
const Conversation = require('../../models/Conversation');
const auth = require('../../middleware/auth');

// get chat-room conversation
router.get('/', auth, (req, res, next) => {
  let response = {success: true};
  Conversation.getChatRoom((err, chatRoom) => {
    if (err || chatRoom == null) {
      response.success = false;
      response.msg = "There was an error on getting the conversation";
      res.json(response);
    } else {
      response.msg = "Conversation retrieved successfuly";
      response.conversation = chatRoom;
      res.json(response);
    }
  });
});

// get conversation
router.get('/:name1/:name2', auth, (req, res, next) => {
  let response = {success: true};
  Conversation.getConversationByName(req.params.name1, req.params.name2, (err, conversation) => {
    if (err) {
      response.success = false;
      response.msg = "There was an error on getting the conversation";
      res.json(response);
    } else {
      response.msg = "Conversation retrieved successfuly";
      response.conversation = conversation;
      res.json(response);
    }
  });
});

module.exports = router;