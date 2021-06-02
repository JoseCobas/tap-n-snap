import React, { useState, useEffect } from 'react';
import Style from './CSS/post.module.scss';
import Location from '../Components/Location';
import Tag from '../Components/Tag';
import { Link } from 'react-router-dom';

function Post({match}) {
    const [post, setPost] = useState([]); 
    const [display, setDisplay] = useState(null);
    
    const fetchPost = async () => {
        const res = await fetch(`http://localhost:4000/posts/${match.params.id}`);
        const data = await res.json();

        setPost(data);
        setDisplay(true);
    }

    useEffect(() => fetchPost(), [match.params.id])

    return display ? (
        <div>
            <div className={Style.wrapper}>
                <div className={Style.post}>
                    <img src={'/uploads/' + post.url} alt={post.tags.join(' ')}/>
                    <div>
                      <div>
                        <Location value="Stockholm, Sweden" />
                        <p>
                          {
                            post.tags.map(tag => (
                              <Tag key={post._id + Math.random()} value={tag} />
                            )) 
                          }
                        </p>
                        <p>By: {post.user}</p>
                      </div>
                      <Link to={`/chat/post/${match.params.id}`} className={Style.icon}>
                        <i className='fas fa-comment-alt'></i>
                      </Link>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

export default Post
