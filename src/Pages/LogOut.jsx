import React, { useState, useEffect } from 'react'
import Style from './CSS/logOut.module.scss'
import { Link } from 'react-router-dom'
import logoImg from '../img/logo.png'
import DelayLink from 'react-delay-link'

function LogOut() {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [id, setId] = useState('');

  const [success, setSuccess] = useState(false);

  const user = async() => {
        const response = await fetch('http://localhost:4000/user', { 
            headers: {'Content-Type': 'application/json'}, 
            credentials: 'include' }
        ).catch((error) => assert.isNotOk(error,'Promise error')); 

        const content = await response.json(); 
        setId(content._id);
  }

  useEffect(() => {
    user()
  }, [id])
      
  const signOut = async () => {
      await fetch("http://localhost:4000/logout", {
        method: "post",
        headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
        },
        credentials: 'include',
      }).catch((error) => assert.isNotOk(error,'Promise error'));
  }

  const updateUser = async() => {
    if (!name) {
      setSuccess(false);
      return; 
    }

    if (!mail) {
      setSuccess(false);
      return; 
    }
    
    await fetch(`http://localhost:4000/users/${id}`, {
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: mail
      })
    }).catch((error) => assert.isNotOk(error,'Promise error'));
    setSuccess(true)
  }
  

  return (
    <div className={Style.wrapper}>
      <img className={Style.img} src={logoImg}></img>
        <h3 className={Style.top}>Change Name:</h3>
        <input placeholder="Name..." onChange={e => setName(e.target.value)}></input>
        <h3>Change Email:</h3>
        <input placeholder="Email..." onChange={e => setMail(e.target.value)}></input>
        { success ? <p className={Style.success}>Changes saved!</p> : <p className={Style.success}></p> }
        <button type="button" className={Style.btnTop} onClick={updateUser}>SAVE</button>
        <DelayLink delay={10} to="/">
            <button type="button" className={Style.btnBot} onClick={signOut}>SIGN OUT</button>
        </DelayLink>
        <br />
        <Link to="/profile">
            <i className="fas fa-chevron-left"></i>        
        </Link>
    </div>
  )
}

export default LogOut
