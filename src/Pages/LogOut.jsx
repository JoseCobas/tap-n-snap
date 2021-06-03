import React, { useState, useEffect } from 'react'
import Style from './CSS/logOut.module.scss'
import { Link } from 'react-router-dom'
import logoImg from '../img/logo.png'
import DelayLink from 'react-delay-link'

function LogOut() {
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
      
  const signOut = async () => {
      try {
      await fetch("http://localhost:4000/logout", {
        method: "post",
        headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
        },
        credentials: 'include',
      })
      } catch(err) {
        console.log(err)
      }
  }

  const updateUser = async() => {
    try {
    await fetch('http://localhost:4000/users/60b5e35b1960e85a20cd8923', { // Make it so the fetch is not hard coded
      method: "put",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: mail 
        // Have to add password encryption
      })
    })
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className={Style.wrapper}>
      <img className={Style.img} src={logoImg}></img>
        <h3 className={Style.top}>Change Name:</h3>
        <input onChange={e => setName(e.target.value)}></input>
        <h3>Change Email:</h3>
        <input onChange={e => setMail(e.target.value)}></input>
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
