let Message = require('./models/Message')

module.exports = app => {

  // a list of open connections
  let connections = [];

  app.get('/api/sse', (req, res) => {
    // Add the response to open connections
    connections.push(res)

    // listen for client disconnection
    // and remove the client's response
    // from the open connections list
    req.on('close', () => { connections = connections.filter(openRes => openRes !== res)
      // message all open connections that a client disconnected

      broadcast('disconnect', {
        message: 'client disconnected' 
      })
    })

    // Set headers to mark that this is SSE
    // and that we don't close the connection
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    })

    // message all connected clients that this 
    // client connected
    broadcast('connect', {
      message: 'client connected'
    })
  })

  // new message handler
  app.post('/api/message', (req, res) => {

    const message = new Message(req.body)

    // Send message to DB
    try {
      res.send(message.save())
    } catch (error) {
      res.send({ message: error })
    }

    // message all open client with new message
    broadcast('new-message', req.body)
  })

  // --------- get messages from DB ---------
  app.get('/messages/:topicID', async (req, res) => {
    try {
      // get only the messages that match the room id
      const messages = await Message.find({ room: req.params.topicID }); 
      res.send(messages);
    } catch (error) {
      res.send({ message: error })
    }
  }) // ------------------------------------

  // --------- get all messages from DB ---------
  app.get('/updateMessages', async (req, res) => {
    try {
      // get only the messages that match the room id
      const messages = await Message.find(); 
      res.send(messages);
    } catch (error) {
      res.send({ message: error })
    }
  }) // ------------------------------------

  // Get specific message
  app.get('/updateMessages/:messageId', async (req, res) => {
    try {
      const message = await Message.findById(req.params.messageId)
      res.send(message)
    } catch (error) {
      res.send({ message: error })
    }
  })

  // Update specific message
  app.patch('/updateMessages/:messageId', async (req, res) => {
    try {
      const updatedMessage = await Message.updateOne(
        { _id: req.params.messageId },
        { $set: {
          author: req.body.author
          }
        }
      )
      res.send(updatedMessage)
    } catch (error) {
      res.send({ message: error })
    }
  })
    


  function broadcast(event, data) {
    // loop through all open connections and send
    // some data without closing the connection (res.write)
    for (let res of connections) {
      res.write('event:' + event + '\ndata:' + JSON.stringify(data) + '\n\n')
    }
  }

  // Heartbeat (send 'empty' events with 20 second delays)
  // helps keep the connection alive
  setInterval(() => {
    broadcast('heartbeat', new Date())
  }, 20000)
};
