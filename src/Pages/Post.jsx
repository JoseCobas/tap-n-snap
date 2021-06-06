import React, { useState, useEffect } from 'react';
import Style from './CSS/post.module.scss';
import Location from '../Components/Location';
import Tag from '../Components/Tag';
import { Link } from 'react-router-dom';

function Post({match}) {
    const [post, setPost] = useState([]); 
    const [display, setDisplay] = useState(null);
    const [likedOrNot, setLikedOrNot] = useState(false);
    
    const fetchPost = async () => {
      const res = await fetch(`http://localhost:4000/posts/${match.params.id}`);
      const data = await res.json();

        setPost(data);
        setDisplay(true);
    }

    const likePost = (e) => {
      const arr = e.currentTarget.id.split(' ')

      const id = arr[0]
      const likes = parseInt(arr[1])
      const numLikes = likes + 1;

      setLikedOrNot(true)

      fetch(`http://localhost:4000/posts/${id}`, { 
        method: "PATCH",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          likes: numLikes,
        })
      })
    }

    useEffect(() => fetchPost(), [match.params.id])

    return display ? (
        <div>
            <div className={Style.wrapper}>
                <div className={Style.post}>
                    <div>
                      <p className={Style.user}>{post.user}</p>
                      <p className={Style.user}>Likes: {post.likes}</p>
                    </div>
                    <img src={'/uploads/' + post.url} alt={post.tags.join(' ')}/>
                    <div>
                      <div>
                        { post.location ? <Location value={post.location}/> : null }
                        <p className={Style.tags}>
                          {
                            post.tags.map(tag => (
                              <Tag key={post._id + Math.random()} value={tag} />
                            )) 
                          }
                        </p>
                      </div>
                      <div className={Style.flexTags}>
                        {
                          likedOrNot ? <div name={post.likes} id={post._id + " " + post.likes} className={Style.iconHeartLiked} onClick={likePost}><i className="fas fa-heart"></i></div>
                          :<div name={post.likes} id={post._id + " " + post.likes} className={Style.iconHeart} onClick={likePost}><i className="fas fa-heart"></i></div>
                        }
                        <Link to={`/chat/post/${match.params.id}`} className={Style.iconComment}>
                          <i className='fas fa-comment-alt'></i>
                        </Link>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}

export default Post
