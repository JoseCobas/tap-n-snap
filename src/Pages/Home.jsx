import React, { useState, useEffect } from 'react'
import Searchbar from '../Components/Searchbar'
import Location from '../Components/Location'
import Tag from '../Components/Tag'
import Style from './CSS/home.module.scss'
import { Link } from 'react-router-dom'
import ReactPullToRefresh from 'react-pull-to-refresh'
import InfiniteScroll from 'react-infinite-scroll-component'

function Home() {
    const [newPosts, setNewPosts] = useState([]); 

    const [display, setDisplay] = useState(null); 
    const [searchValue, setSearchValue] = useState('')
    const [items, setitems] = useState(Array.from({ length: 2 }))
    
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

    const fetchMoreData = () => {
      // a fake async api call like which sends
      // 2 more records in 1 sec
      setTimeout(() => {
        this.setState({
          items: items.concat(Array.from({ length: 2 }))
        });
      }, 1000);
    };

    useEffect(() => fetchPosts(), [])

    return display ? (
        <ReactPullToRefresh onRefresh={handleRefresh} className="wrapperRefresh">
            <Searchbar search={fetchFilteredPosts} searchValue={searchValue} setSearchValue={setSearchValue} />
                  <InfiniteScroll
                    dataLength={items.length}
                    next={fetchMoreData}
                    style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                    inverse={true}
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="scrollableDiv"
                  >
                    {items.map((i, index) => (
                      newPosts.sort((a, b) => a.date > b.date ? -1 : 1).map(post => (
                            <div key={post['_id']} className={Style.wrapper}>
                              <div className={Style.post}>
                              <p className={Style.user}>{post.user}</p>
                                <Link to={`/post/${post['_id']}`}>
                                  <img src={'/uploads/' + post.url} alt={post.tags.join(' ')}/>
                                </Link>
                                <div>
                                  <div>
                                    { post.location ? <Location value={post.location}/> : null }
                                    <p className={Style.tags}>{post.tags.map(tag => <Tag key={Date.now() + Math.random()} value={tag} />) }</p>
                                  </div>
                                  <Link to={`/chat/post/${post['_id']}`} className={Style.icon}>
                                    <i className='fas fa-comment-alt'></i>
                                  </Link>
                                </div>
                              </div>
                            </div>
                        ))
                    ))
                        
                    }
              </InfiniteScroll>
        </ReactPullToRefresh>
    ) : null;
}

export default Home
