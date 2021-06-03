import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import Style from './CSS/start.module.scss'
import logoImg from '../img/logo.png'
import DelayLink from 'react-delay-link'

function Start() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [name, setName] = useState('')
  const [transition, setTransition] = useState(false)

  const change = () => {
    setTransition(true)
  }

  const user = async() => { 
    const response = await fetch('http://localhost:4000/user', { 
        headers: {'Content-Type': 'application/json'}, 
        credentials: 'include' }
    ); 

    const content = await response.json(); 
    setName(content.name); 
} 

  useEffect(() => {
    user()
    if (name == "") { return; }

    setIsLoggedIn(true)
  }, [name])

  return isLoggedIn ? <Redirect to="/home" /> :(
    <div className={Style.container}>
      {transition ? <img className={Style.imgChange} src={logoImg} /> : <img className={Style.img} src={logoImg} />}
      {transition ? <h4 className={Style.h4Change}>Share with the tap of a button</h4> : <h4 className={Style.h4}>Share with the tap of a button</h4>}
      <DelayLink delay={1200} to="/login">
        {transition ? <button className={Style.btnChange} onClick={change}>SIGN IN</button> : <button className={Style.btn} onClick={change}>SIGN IN</button> }
      </DelayLink>
      <DelayLink delay={1200} to="/register">
        {transition ? <button className={Style.btnChange} onClick={change}>SING UP</button> : <button className={Style.btn} onClick={change}>SIGN UP</button> }
      </DelayLink>
    </div>
  )
}

export default Start
