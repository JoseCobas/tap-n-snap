import React, { useState, useEffect } from 'react'
import Searchbar from '../Components/Searchbar'
import Location from '../Components/Location'
import Tag from '../Components/Tag'
import Style from './CSS/home.module.scss'
import { Link } from 'react-router-dom'
import ReactPullToRefresh from 'react-pull-to-refresh'

function Home() {
    const [newPosts, setNewPosts] = useState([]); 

    const [display, setDisplay] = useState(null); 
    const [searchValue, setSearchValue] = useState('');
    
    const fetchPosts = async () => {
        const res = await fetch('http://localhost:4000/posts');
        const data = await res.json();

        setNewPosts(data);
        setDisplay(true);
    }

    const fetchFilteredPosts = async (value) => {
        let resUrl = value ? '/filter/' + value : '';
        const res = await fetch('http://localhost:4000/posts/' + resUrl);
        const data = await res.json();

        console.log(data);
        setNewPosts(data);
    }

    function handleRefresh() {
        const success = true
        if (success) {
          setTimeout(function(){ window.location.reload(false); }, 700);
        } else {
          console.log("Scroll refresh failed")
        }
    }

    const likePost = (e) => {
      const arr = e.currentTarget.id.split(' ')

      const id = arr[0]
      const likes = parseInt(arr[1])
      const numLikes = likes + 1;

      console.log(id)
      console.log(likes)
      console.log(numLikes)

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

    useEffect(() => fetchPosts() , [])

    return display ? (
        <ReactPullToRefresh onRefresh={handleRefresh} className="wrapperRefresh">
            <Searchbar search={fetchFilteredPosts} searchValue={searchValue} setSearchValue={setSearchValue} />
            <div className={Style.postContainer}>
                {
                    newPosts.sort((a, b) => a.date > b.date ? -1 : 1).map(post => (
                        <div key={post['_id']} className={Style.wrapper}>
                          <div className={Style.post}>
                          <div>
                            <p className={Style.user}>{post.user}</p>
                            <p className={Style.user}>Likes: {post.likes}</p>
                          </div>
                            <Link to={`/post/${post['_id']}`}>
                              <img src={'/uploads/' + post.url} alt={post.tags.join(' ')}/>
                            </Link> 
                            <div>
                              <div>
                                { post.location ? <Location value={post.location}/> : null }
                                <p className={Style.tags}>{post.tags.map(tag => <Tag key={Date.now() + Math.random()} value={tag} />) }</p>
                              </div>
                              <div name={post.likes} id={post._id + " " + post.likes} className={Style.icon} onClick={likePost}><i className="fas fa-heart"></i></div>
                              <Link to={`/chat/post/${post['_id']}`} className={Style.icon}>
                                <i className='fas fa-comment-alt'></i> 
                              </Link>
                            </div>
                          </div>
                        </div>
                    ))
                }
            </div>
        </ReactPullToRefresh>
    ) : null;
}

export default Home
