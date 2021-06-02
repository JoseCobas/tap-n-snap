import React, { useState, useEffect } from 'react'
import Searchbar from '../Components/Searchbar'
import Tag from '../Components/Tag'
import Style from './CSS/home.module.scss';
import { Link } from 'react-router-dom'

function Home() {

    const [newPosts, setNewPosts] = useState([]); 
    const [display, setDisplay] = useState(null); 
    
    const fetchPosts = async () => {
        const res = await fetch('http://localhost:4000/posts');
        const data = await res.json();

        setNewPosts(data);
        setDisplay(true);
    }

    useEffect(() => fetchPosts(), [])

    return display ? (
        <div>
            <Searchbar />
            <div className={Style.postContainer}>
                {
                  newPosts.map(post => (
                      <div key={post['_id']} className={Style.wrapper}>
                          <div className={Style.post}>
                            <Link to={`/post/${post['_id']}`}>
                              <img src={'/uploads/' + post.url} alt={post.tags.join(' ')}/>
                            </Link>
                            <div>
                              <div>
                                <p>{post.tags.map(tag => <Tag key={Date.now() + Math.random()} value={tag} />) }</p>
                                <p>By: {post.user}</p>
                              </div>
                              <Link to={`/chat/${post['_id']}`} className={Style.icon}>
                                <i className='fas fa-comment-alt'></i>
                              </Link>
                            </div>
                          </div>
                      </div>
                  )).sort((a, b) => b - a) // Reverse order, so newest posts at top
                }
            </div>
        </div>
    ) : null;
}

export default Home
