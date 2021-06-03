import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Location from '../Components/Location';
import Tag from '../Components/Tag';
import Style from './CSS/chat.module.scss';

function Chat({ match }) {

  const id = match.params.id;
  const type = match.params.type;

  const [topic, setTopic] = useState([]); 
  const [display, setDisplay] = useState(false); 

  const [newMessage, setNewMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [name, setName] = useState('');

  const user = async() => { 
    try {
        const response = await fetch('http://localhost:4000/user', { 
            headers: {'Content-Type': 'application/json'}, 
            credentials: 'include' }
        ); 

        const content = await response.json(); 
        setName(content.name);
    } catch(err) {
        console.log(err)
    }
  }

  const fetchData = async () => {
    let messageParam; 
    user();

    // Fetch topic
    if (type === 'post') {
      const topicRes = await fetch('http://localhost:4000/posts/' + id);
      const topicData = await topicRes.json();

      setTopic(topicData);
      messageParam = topicData.id;
    } else {
      const room = type + '_' + id.replace(', ', '-').toLowerCase(); // turns location into: location_sweden-stockholm

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

    if(!newMessage) {
      console.log("No message")
      return;
    }

    fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: newMessage,
        author: name,
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
    user();
    fetchData();
    let sse = startSSE();

    return () => sse.close(); 
  }, [id, name])

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
              { topic.location ? <Location value={topic.location} /> : null }
              <p>{ topic.tags.map(tag => <Tag key={Date.now() + Math.random()} value={tag} />) }</p>
              <p>By: {topic.user}</p>
            </div> 
          </div> ) :

        type === 'tag' ? (
          <div className={`${Style.topic} ${Style.altTopic}`}>
            <p className={Style.tagStyle}>{id}</p>
          </div> ) :

        type === 'location' ? (
          <div className={`${Style.topic} ${Style.altTopic}`}>
            <Location value={id} />
          </div> ) : null
      }

      <div className={Style.chatSection}>
        {
          allMessages.map(message => ( message.author == name ?
            <div key={Math.random() + Date.now()} className={Style.messageRight}>
              <div className={Style.messageBox}>
                <span>{message.author}</span>
                <div className={Style.snapMessage}>
                  <p>{message.text}</p>
                </div>
              </div>
            </div>
            :<div key={Math.random() + Date.now()} className={Style.message}>
              <span>{message.author}</span>
              <div className={Style.snapMessage}>
                <p>{message.text}</p>
              </div>
            </div>
          ))
        }
      </div>

      <form onSubmit={postMessage}>
        <div className={Style.align} >
          <input placeholder="Message..." type="text" onChange={e => setNewMessage(e.target.value)} value={newMessage} />
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  ) : null;
}

export default Chat
