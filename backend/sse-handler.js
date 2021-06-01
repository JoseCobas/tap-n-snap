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
    req.on('close', () => {
      connections = connections.filter(openRes => openRes != res)
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
      message: 'clients connected: ' + connections.length
    })
  })

  // new message handler
  // app.post('http://localhost:4000/api/message', (req, res) => {
  app.post('/api/message', (req, res) => {
    let message = req.body

    // message all open client with new message
    broadcast('new-message', message)
    res.send('ok')
  })

  function broadcast(event, data) {
    // loop through all open connections and send
    // some data without closing the connection (res.write)
    for (let res of connections) {
      res.write('event:' + event + '\ndata:' + JSON.stringify(data) + '\n\n')
    }
  }

  // // Send an event when a something happens in the message db
  // Message.watch().on('change', e => {
  //   console.log("OK", e);
  //   console.log("connectons", connections.length);
  //   connections.forEach(({ res }) =>
  //     sendSSE(res, 'chatMessageUpdate', e))
  // });

  // Heartbeat (send 'empty' events with 20 second delays)
  // helps keep the connection alive
  // setInterval(
  //   () => connections.forEach(({ res }) =>
  //     sendSSE(res, 'heartbeat', new Date())),
  //   20000
  // );
};
