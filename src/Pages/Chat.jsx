import React, {useEffect, useState} from 'react'
import Style from './CSS/chat.module.scss';

function Chat() {

  const [newMessage, setNewMessage] = useState('');
  const [allMessages, setAllMessages] = useState([{ _id: '123', text: 'hello', author: 'James' }]);

  const postMessage = (e) => {
    e.preventDefault();

    // fetch('http://localhost:4000/api/message', {
    fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: newMessage,
        author: 'User123'
      })
    })

    setNewMessage(''); // Clear input field
  }

  const startSSE = () => {

    // let sse = new EventSource('http://localhost:4000/api/sse')
    let sse = new EventSource('/api/sse')

    sse.addEventListener('connect', message => {
      let data = JSON.parse(message.data)
      console.log('[connect]', data);
    })

    sse.addEventListener('disconnect', message => {
      let data = JSON.parse(message.data)
      console.log('[disconnect]', data);

    })

    sse.addEventListener('new-message', message => {
      let data = JSON.parse(message.data)
      console.log('[new-message]', data);

      setAllMessages(messages => [...messages, data]);
    })
  }

  useEffect(() => {
    startSSE();
  }, [])

  return (
    <div className={Style.Chat}>
      <div className={Style.topic}>
        <img src="https://source.unsplash.com/random/200x240" alt="post image" />
        <div>
          <p>Stockholm, Sweden</p>
          <p>Tags: <span>Tag</span><span>Tag</span><span>Tag</span></p>
        </div>
      </div>

      <div className={Style.chatSection}>
        {
          // <div key={message._id} className={Style.message}>

          allMessages.map(message => (
            <div key={message.sent + Math.random()} className={Style.message}>
              <span>{message.author}</span>
              <p>{message.text}</p>
            </div>
          ))
        }
      </div>

      <form onSubmit={postMessage}>
        <input type="text" onChange={e => setNewMessage(e.target.value)} value={newMessage} />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default Chat
