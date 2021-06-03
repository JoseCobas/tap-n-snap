import React, { useState, useEffect } from 'react';
import Location from '../Components/Location';
import Tag from '../Components/Tag';
import Style from './CSS/createPost.module.scss';
import { Link } from 'react-router-dom';

const CreatePost = () => {

    // State for Post data
    const [imageData, setImageData] = useState('');

    // State for geolocation coordinates
    const [lat, setLat] = useState('');
    const [long, setLong] = useState(''); 

    const [message, setMessage] = useState(false);
    const [name, setName] = useState('');
    const [location, setLocation] = useState(''); 

    // Tag states
    const [newTag, setNewTag] = useState('');
    const [tags, setTags] = useState([]);

    const photoChosen = () => {
        let file = document.forms.textForm.file.files[0];
        if (!file) { return; }
        // convert the file data to a base64-encoded url
        // used for preview and also for saving the photo later
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            // imageData = reader.result;
            setImageData(reader.result);
        }, false);
        reader.readAsDataURL(file);
    }

 // Get coordinates for location
    const getLocation =  () => {
    navigator.geolocation.getCurrentPosition(position => {
        setLat(position.coords.latitude)
         setLong(position.coords.longitude)
    }, err => console.log(err)
    );
    console.log(lat, long)
    }

    
    const printLocation =  () => {
        setMessage(true)
    };

    const removeLocation = () => {
        setMessage(false)
    };

    const fetchLocation = async () => {
        const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' +`${lat},${long}` + '&result_type=locality&key=AIzaSyBzpTdrJHHqA12vSEEGI-vvtn85FEC94hs')
        const data = await response.json();
        setLocation(data['results'][0].formatted_address)

        console.log(location)
    }



    const user = async() => {
        const response = await fetch('http://localhost:4000/user', {
              headers: {'Content-Type': 'application/json'},
              credentials: 'include'
        });
  
        const content = await response.json();

        setName(content.name);
    }

    const uploadPhoto = async e => {
        e.preventDefault();
        // If no photo chosen do nothing
        if (!imageData) { return; }

        console.log(location);

        fetch("http://localhost:4000/posts", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: imageData,
                user: name, 
                tags: tags,
                location: location
            })
        })

        console.log('Photo uploaded!');
    }

    const addTag = () => {
        const boxValue = document.getElementById('tagBox').value;

        if(boxValue == ""){
            console.log(tags);
            return;
        } else {
            setTags(tags => [...tags, newTag]);
            setNewTag('');
        }
    }

    function removeTag(tagToRemove) {
        setTags(tags => (
            tags.filter(tag => tag !== tagToRemove))
        )
    }

    // Re-render with callback
    useEffect(() => {
        addTag()
        user()
    }, [tags]);

    useEffect(() => {
        getLocation()
        fetchLocation()
    }, [long]);

    return (
        <div>
        <form name="textForm" className={Style.form}>
            <div className={Style.wrapper}>
                {imageData ? <img src={imageData} width="175" /> : <div className={Style.placeholder}><i className="fas fa-user fa-5x"></i></div>}
                <div className={Style.buttonLayout}>
                    <input type="file" name="file" accept="image/*" onChange={photoChosen} className={Style.inputFile} />
                    <input type="button" value="TAKE PHOTO" className={Style.inputButton} />
                    
                    <div className = {Style.getlocation}>
                      {message ? <button onClick= {removeLocation} >Hide Location</button> : <button className = {Style.getLocation} onClick={fetchLocation} onClick={printLocation} >Get Location</button>}
                        {message && <p className = {Style.location}>Your location is: {lat}, {long}</p> }
                    </div>
                        {/*
                        location.map(location => <p key={location + Math.random()} >{location.formatted_address}</p>)
                        */}
                    { location ? <p key={location + Math.random()}>{location} <i className="fa fa-map-marker" aria-hidden="true"></i></p> : null }
                </div>
            </div>

            <div className={Style.tags}>
                <input id="tagBox" maxLength="15" type="text" placeholder="Enter tags" onChange={e => setNewTag(e.target.value)} value={newTag} autoComplete="off"/>
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
            <div className={Style.submit}>
                <input onClick={uploadPhoto} type="submit" value="&#xf067;" className={`${Style.inputButton} ${Style.inputSubmit}`} />
            </div>
            <Link to="/home" className={Style.iHelper}>
                <i className="fas fa-chevron-left"></i>
            </Link>
        </form>
        </div>
        
    )
}

export default CreatePost;
