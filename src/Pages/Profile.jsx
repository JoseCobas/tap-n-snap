import React, { useState, useEffect } from 'react' 
import Style from './CSS/profile.module.scss' 
import Image from '../img/IMG_7468.png' 
import { Link } from 'react-router-dom' 
import axios from 'axios'

function Profile() { 
    const [visible, setVisible] = useState(false) 
    const [display, setDisplay] = useState(true)
    const [postData, setPostData] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [id, setId] = useState('')
    const [userPosts, setUserPosts] = useState([]) 
    const [test, setTest] = useState(false)
    const [loading, setLoading] = useState(true)
    const jwt = localStorage.getItem("token")


    const user = async() => { 
        try {

            var data = '';

      var config = {
        method: 'get',
        url: 'http://localhost:4000/user',
        headers: { 
          'Authorization': `Bearer ${jwt}`  },
        data : data
      };

      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
            setName(response.data && response.data.name); 
            setEmail(response.data && response.data.email);
            setId(response.data &&response.data._id);
      })
      .catch(function (error) {

        console.log(error);
      });

        } catch(err) {
            console.log(err)
        }
    }
        
    const fetchPosts = async() => { 
        try {

            var data = '';

    var config = {
      method: 'get',
      url: 'http://localhost:4000/posts',
      headers: { 
        'Authorization': `Bearer ${jwt}`  },
      data : data
    };

    axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      const data = response.data;
    setPostData(response.data)
    })
    .catch(function (error) {

      console.log(error);
    });
            
        } catch(err) {
            console.log(err)
        }
    }
    useEffect(() => {
        if(jwt) {
            user() 
        fetchPosts()
        }
    }, [])

    useEffect(() => {
            let userPost = []
        if(id && postData) {
            userPost = postData && postData.filter(post => post.author == id)
            console.log(userPost)
            setUserPosts(userPost)
            setLoading(false)
        }
    }, [postData, id])
  
    useEffect(() => { 
        let mounted = true 
        var listener = document.addEventListener("scroll", e => { 
        if (mounted) { 
            const scrolled = document.documentElement.scrollTop; 
            if (scrolled > 10){ setVisible(true) 
            } 
            else if (scrolled <= 10){ setVisible(false) } 
        } })
        
        

        const timer = setTimeout(() => {
            setDisplay(true) 
        }, 200);

        return () => { 
            document.removeEventListener("scroll", listener) 
            mounted = false 
        } 
    }, [visible, name, id]) 
                        
    return display ? ( 
    <div> {loading ? <div ><p style={{color: 'white', textAlign: 'center', fontSize: '24px', paddingTop: '200px'}}>Loading.....</p></div> : (
        <>
        <div className={`${ visible ? Style.iHelperSmall : Style.iHelper}`}> 
        <Link to="/logout"> <i className="fas fa-cog fa-2x"></i> </Link> 
        </div> 
        <div className={Style.wrapper}> 
            <div className={Style.profileInfo}> 
                <p className={Style.h1}>{name}</p> 
                <p>{email}</p> 
            </div> 
        </div> 
        <hr/> 
        <div className={Style.imagesWrapper}> 
            { test ? <p className={Style.empty}>Nothing here... Post something!</p> :
              userPosts.map(post => ( post ?
                <Link to={`/post/${post['_id']}`} key={post + Math.random()}>
                  <img key={post + Math.random()} src={`/uploads/${post.url}`} alt={post.tags.join(' ')}/> 
                </Link> : null
              ))
            }
        </div></> )}
    </div> 
    ) : null
} 

export default Profile
