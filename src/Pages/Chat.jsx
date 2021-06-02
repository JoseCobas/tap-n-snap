import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Style from './CSS/chat.module.scss';

function Chat({ match }) {

  const [topic, setTopic] = useState([]); 
  const [display, setDisplay] = useState(false); 

  const [newMessage, setNewMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);

  const fetchData = async () => {
    // Fetch topic
    const topicRes = await fetch('http://localhost:4000/posts/' + match.params.id);
    const topicData = await topicRes.json();
    setTopic(topicData);

    // Fetch messages
    const messagesRes = await fetch('http://localhost:4000/messages/' + topicData._id);
    const messagesData = await messagesRes.json();
    setAllMessages(messagesData);

    // Show page
    setDisplay(true);
  }

  const postMessage = (e) => {
    e.preventDefault();

    fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: newMessage,
        author: 'User123',
        room: topic._id
      })
    })

    setNewMessage(''); // Clear input field
  }

  const startSSE = () => {

    let sse = new EventSource('/api/sse');

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

    return sse;
  }


  useEffect(() => {
    fetchData();
    let sse = startSSE();

    return () => sse.close(); // !!! doesn't trigger req.on('close') in sse-handler.js !!! could be cause of memory leak
  }, [])

  return display ? (
    <div className={Style.Chat}>
      <Link to="/home" className={Style.backArrow}>
          <i className="fas fa-chevron-left"></i>
      </Link>

      <div className={Style.topic}>
        <img src={'/uploads/' + topic.url} alt={topic.tags.join(' ')} />
        <div>
          <p>Tags: { topic.tags.map(tag => <span key={tag}>{tag}</span>) }</p>
          <p>By: {topic.user}</p>
        </div>
      </div>

      <div className={Style.chatSection}>
        {
          // Not perfeclty unique key prop
          allMessages.map(message => (
            <div key={Math.random() + Date.now()} className={Style.message}>
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
  ) : null;
}

export default Chat
