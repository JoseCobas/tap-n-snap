import React, { useState, useEffect } from 'react';
import Style from './CSS/createPost.module.scss';
import { Link } from 'react-router-dom';
import { scale } from '../utilities/scale';
import Navbar from '../Components/Navbar';
import { useHistory } from 'react-router-dom';

const CreatePost = () => {

    // State for Post data
    const [imageData, setImageData] = useState('');

    // State for geolocation coordinates
    const [lat, setLat] = useState('');
    const [long, setLong] = useState('');

    const [message, setMessage] = useState(false);
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [location, setLocation] = useState(''); 
    const [active, setActive] = useState(false); 

    // Tag states
    const [newTag, setNewTag] = useState('');
    const [tags, setTags] = useState([]);

    let history = useHistory();

    const photoChosen = () => {
        let file = document.forms.textForm.file.files[0];
        if (!file) { return; }
        // convert the file data to a base64-encoded url
        // used for preview and also for saving the photo later
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setImageData(reader.result);
        }, false);
        reader.readAsDataURL(file);
        setActive(true)
    }

    // Get coordinates for location
    const getLocation = () => {
        navigator.geolocation.getCurrentPosition(position => {
            setLat(position.coords.latitude)
            setLong(position.coords.longitude)
        }, err => console.log(err));
    }

    const removeLocation = () => {
        setMessage(false)
    };

    // Get location with coordinates
    const fetchLocation = async () => {
        const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' +`${lat},${long}` + '&result_type=locality&key=AIzaSyBzpTdrJHHqA12vSEEGI-vvtn85FEC94hs')
        const data = await response.json();
        setLocation(data['results'][0].formatted_address)

        setMessage(true)
    }

    const user = async() => {
        const response = await fetch('http://localhost:4000/user', {
              headers: {'Content-Type': 'application/json'},
              credentials: 'include'
        });
  
        const content = await response.json();
        setName(content.name);
        setAuthor(content._id);
    }

    const uploadPhoto = async e => {
        e.preventDefault();
        // If no photo chosen do nothing
        if (!imageData) { return; }

        const url = await scale(imageData, 900, 900, 0.75);

        let post = {
            url: url,
            user: name,
            author: author,
            likes: 0,
            tags: tags,
            location: location
        }
      
        if('serviceWorker' in navigator && 'SyncManager' in window) {

            await IDB.add('sync-messages', post);

            const sw = await navigator.serviceWorker.ready;
            await sw.sync.register('sync-new-messages');
        }else {
            fetch('http://localhost:4000/posts', {
              method: "post",
              headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
              },
              body: JSON.stringify(post)
            });
        }

        // fetch("http://localhost:4000/posts", {
        //     method: "post",
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         url: url,
        //         user: name,
        //         author: author,
        //         likes: 0,
        //         tags: tags,
        //         location: location
        //     })
        // })

        console.log('Photo uploaded!');
        window.imageSrc = null; // Removes taken pic from window

        const timer = setTimeout(() => {
            history.push('/home')
        }, 300);
    }

    const addTag = () => {
        const boxValue = document.getElementById('tagBox').value;

        if (boxValue == "") { return; } 

        setTags(tags => [...tags, newTag]);
        setNewTag('');
    }

    function removeTag(tagToRemove) {
        setTags(tags => (
            tags.filter(tag => tag !== tagToRemove))
        )
    }

    function redirect() {
        history.push('/camera')
        window.imageSrc = null;
    }

    // Re-render with callback
    useEffect(() => {
        addTag()
        user()
        if(window.imageSrc) {
            setImageData(window.imageSrc)
            setActive(true)
        }
    }, [tags, active]);

    function searchLocation() {
        var autoComplete = new google.maps.places.Autocomplete((document.getElementById('searchInput')), {
            types: ['geocode'],
        })
    }

    useEffect(() => {
        getLocation()

        searchLocation()
    }, [long]);

    const test = (e) => {
        setLocation(document.getElementById('searchInput').value)
        setMessage(true)

        document.getElementById('searchInput').value = ""
    }

    return (
        <div>
        <Navbar />
        <form name="textForm" className={Style.form}>
            <div className={Style.wrapper}>
                {imageData ? <img src={imageData} width="175" /> : <div className={Style.placeholder}><i className="fas fa-user fa-5x"></i></div>}
                <div className={Style.buttonLayout}>
                    <input type="file" name="file" accept="image/*" onChange={photoChosen} className={Style.inputFile}/>
                    {/* location ? <p key={location + Math.random()}>{location} <i className="fa fa-map-marker" aria-hidden="true"></i></p> : null */}
                    <input type="button" value="Take photo" className={Style.inputButton} onClick={redirect}/>
                </div>
            </div>
            <div className={Style.tags}>
                <div className={Style.centerDiv}>
                    {
                        message ? <div key={location + Math.random()}><p id="test" className={Style.location}>{location} </p></div>
                                : <p id="test" className={Style.location}></p>
                    }
                    <div className = {Style.getlocation}>
                        {
                          message ? <button type="button" className={Style.getLocation} onClick={removeLocation}>Remove</button> 
                                  : <button type="button"  className={Style.getLocation} onClick={fetchLocation}>Get Location</button>
                        }
                    </div>
                    <input className={Style.inputGeo} type="text" id="searchInput" placeholder="Search location..." onChange={e => setLocation(e.target.value)} />
                        <button type="button" className={Style.icon} onClick={test}><i className="fas fa-check"></i></button>
                    <hr />
                    <input id="tagBox" maxLength="15" type="text" placeholder="Enter tags..." onChange={e => setNewTag(e.target.value)} value={newTag} autoComplete="off"/>
                        <button type="button" className={Style.icon} onClick={addTag}><i className="fas fa-check"></i></button>
                    <div className={Style.tagDiv}>
                        {
                            tags.map(tag => (
                                <div key={Date.now() + Math.random()} onClick={() => removeTag(tag)}>
                                    {tag} <i className="fas fa-times"></i>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className={Style.submit}>
                <input onClick={uploadPhoto} type="button" value="&#xf067;" className={Style.inputSubmit} />
            </div>
            <Link to="/home" className={Style.iHelper}>
                <i className="fas fa-chevron-left"></i>
            </Link>
        </form>
        </div>
        
    )
}

export default CreatePost;
