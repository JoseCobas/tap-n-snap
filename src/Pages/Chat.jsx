import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Tag from '../Components/Tag';
import Style from './CSS/chat.module.scss';

function Chat({ match }) {

  const id = match.params.id;
  const type = match.params.type;

  const [topic, setTopic] = useState([]); 
  const [display, setDisplay] = useState(false); 

  const [newMessage, setNewMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);

  const fetchData = async () => {
    let messageParam; 

    // Fetch topic
    if (type === 'post') {
      const topicRes = await fetch('http://localhost:4000/posts/' + id);
      const topicData = await topicRes.json();

      setTopic(topicData);
      messageParam = topicData.id;
    } else {
      const room = type + '_' + id;

      setTopic({ _id: room});
      messageParam = room;
    }

    // Fetch messages
    const messagesRes = await fetch('http://localhost:4000/messages/' + messageParam);
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

    return () => sse.close(); 
  }, [])

  return display ? (
    <div className={Style.Chat}>
      <Link to="/home" className={Style.backArrow}>
          <i className="fas fa-chevron-left"></i>
      </Link>
      {  
        /* Conditionally render chat header (topic) based on type of chat */
        type === 'post' ? (
          <div className={Style.topic}>
            <img src={'/uploads/' + topic.url} alt={topic.tags.join(' ')} />
            <div>
              <p>Tags: { topic.tags.map(tag => <Tag key={Date.now() + Math.random()} value={tag} />) }</p>
              <p>By: {topic.user}</p>
            </div> 
          </div> ) :

        type === 'tag' ? (
          <div className={Style.topic}>
            <h2>#{id}</h2>
          </div> ) :

        type === 'location' ? (
          <div className={Style.topic}>
            <h2>{id} 
              <i class="fa fa-map-marker" aria-hidden="true"></i>
            </h2>
          </div> ) : null
      }

      <div className={Style.chatSection}>
        {
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
