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
  const [users, setUsers] = useState('');

  const user = async() => { 
    try {
        const response = await fetch('http://localhost:4000/user', { 
            headers: {'Content-Type': 'application/json'}, 
            credentials: 'include' }
        ); 

        const content = await response.json(); 
        setName(content.name);
        setUsers(content._id);
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
      messageParam = topicData._id;
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

  const postMessage = async (e) => {
    e.preventDefault();

    if(!newMessage) {
      console.log("No message")
      return;
    }



    let message = {
      text: newMessage,
      author: name,
      user: users,
      room: topic._id
    }

    // sync messages with the service worker
    if('serviceWorker' in navigator && 'SyncManager' in window) {
      // store message in indexedDB, so the service worker
      // gets access to it
      await IDB.add('sync-messages', message);

      // tell the service worker that there's messages
      // waiting to be sent to the server
      const sw = await navigator.serviceWorker.ready;
      await sw.sync.register('sync-new-messages');
    }
    // or send message manually
    else {
      fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
    }



    // fetch('/api/message', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     text: newMessage,
    //     author: name,
    //     user: users,
    //     room: topic._id
    //   })
    // });


    setNewMessage(''); // Clear input field
  }

  useEffect(() => {
    user();
    fetchData();
  }, [id, name])

  useEffect(() => {
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

    sse.onerror = (error) => {
      console.log(error)
      sse.close()
    }

    return () => {
      console.log(sse)
      sse.close();
    };
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
              { topic.location ? <Location value={topic.location} /> : null }
              <p className={Style.pWrapper}>{ topic.tags.map(tag => <Tag key={Date.now() + Math.random()} value={tag} />) }</p>
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
          allMessages.map(message => ( message.user == users ?
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
          <button type="submit"><i className="fas fa-paper-plane"></i></button>
        </div>
      </form>
    </div>
  ) : null;
}

export default Chat
