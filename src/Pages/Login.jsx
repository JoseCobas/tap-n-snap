import React, { useState, useEffect } from 'react'
import Style from './CSS/login.module.scss'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import logoImg from '../img/logo.png'
import DelayLink from 'react-delay-link'

function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [correctDetails, setCorrectDetails] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [transition, setTransition] = useState(false)
  const [transitionImg, setTransitionImg] = useState(false)

  const change = () => {
    setTransition(true)
  }

  const login = async e => {
    e.preventDefault();
    // If any field is blank don't send request
    if (!email && !password) {
      setCorrectDetails(true);
      return; 
    }
    
    fetch("http://localhost:4000/login", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            email,
            password
        })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data.message)
      
      setCorrectDetails(true);
      if (data.message === 'Login Succesful!') {
        setCorrectDetails(false);
        setTransition(true)
        setTransitionImg(true)
        const timer = setTimeout(() => {
          setIsLoggedIn(true)
        }, 700);
      }
    })
    .catch(error => console.log('ERROR!', error));
  }

  useEffect(() => {
    setCorrectDetails(false)
  }, [])

  return isLoggedIn ? <Redirect to="/home" /> : ( // conditional rendering with react (with ternary operators) <--
    <div className={Style.wrapper}>
        { transitionImg ? <img className={Style.imgChange} src={logoImg} /> : <img className={Style.img} src={logoImg} />}
        {
          transition ?
            <form className={Style.formChange} onSubmit={login}>
            <div className={Style.inputFieldMail}>
              <i className="fas fa-user" />
              <input type="email" placeholder="Email... " className={Style.inputMail} onChange={e => setEmail(e.target.value)} autoComplete="off"/> <br />
            </div>
            <div className={Style.inputFieldPassword}>
              <i className="fas fa-key" />
              <input type="password" placeholder="Password..." className={Style.inputPassword} onChange={e => setPassword(e.target.value)} autoComplete="off"/>
            </div>
            <button type="submit" className={Style.btn} >SIGN IN</button>
          </form>
          :<form className={Style.form} onSubmit={login}>
            <div className={Style.inputFieldMail}>
              <i className="fas fa-user" />
              <input pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" type="email" placeholder="Email..." 
              className={Style.inputMail} onChange={e => setEmail(e.target.value)} autoComplete="off" required/> <br />
            </div>
            <div className={Style.inputFieldPassword}>
              <i className="fas fa-key" />
              <input type="password" placeholder="Password..." className={Style.inputPassword} onChange={e => setPassword(e.target.value)} autoComplete="off" required/>
            </div>
            { correctDetails ? <p className={Style.error} >Wrong email or password!</p> : null }
            <button type="submit" className={Style.btn} >SIGN IN</button>
          </form>
        }
        <br />
        { transition ? 
          <h4 className={Style.pChange}>Already have an account?<DelayLink delay={700} to='/register'><p className={Style.link} onClick={change}>Sing In</p></DelayLink></h4>
          :<h4 className={Style.p}>Already have an account?<DelayLink delay={700} to='/register'><p className={Style.link} onClick={change}>Sing In</p></DelayLink></h4>
        }
    </div>
  )
}

export default Login