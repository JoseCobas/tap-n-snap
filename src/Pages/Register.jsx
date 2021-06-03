import React, { useState, useEffect } from 'react'
import Style from './CSS/register.module.scss'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import logoImg from '../img/logo.png'
import DelayLink from 'react-delay-link'

function Register() {
       const [isLoggedIn, setIsLoggedIn] = useState(false);

       const [userName, setUserName] = useState('');
       const [email, setEmail] = useState('');
       const [password, setPassword] = useState('');
       const [passwordMatch, setPasswordMatch] = useState('');
       
       const [error, setError] = useState(false)
       const [transition, setTransition] = useState(false)
       const [transitionImg, setTransitionImg] = useState(false)

       const change = () => {
              setTransition(true)
       }

       const uploadUser = async e => {
              e.preventDefault();
              // If any field is blank don't send request
              if (!userName && !email && !password) { return; }

              if (password != passwordMatch) { 
                     setError(true) 
                     return; 
              }

              fetch("http://localhost:4000/register", {
                     method: "post",
                     headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                     },
                     body: JSON.stringify({
                            name: userName,
                            email,
                            password
                     })
              })
              .then(res => res.json())
              .then(data => {
                     console.log(data.message)
                     setError(false) 
                     if (data.message === 'User Added succesfully!') {
                            setTransition(true)
                            setTransitionImg(true)
                            const timer = setTimeout(() => {
                                   setIsLoggedIn(true);
                            }, 700);
                     }
              }).catch(error => console.log('ERROR!', error));
       }

       useEffect(() => {
              setError(false)
        }, [])

       return isLoggedIn ? <Redirect to="/home" /> : (
              <div className={Style.wrapper}>
                     { transitionImg ? <img className={Style.imgChange} src={logoImg} /> : <img className={Style.img} src={logoImg} />}
                     {transition ?
                            <form className={Style.formChange} onSubmit={uploadUser}>
                                   <div className={Style.inputFieldUser}>
                                          <i className="fas fa-user" ></i>
                                          <input type="username" placeholder="Username..." className={Style.inputUsername} 
                                          onChange={e => setUserName(e.target.value)} autoComplete="off"/><br />
                                   </div>
                                   <div className={Style.inputFieldMail}>
                                          <i className="fas fa-envelope"></i>
                                          <input type="email" placeholder="Email..." className={Style.inputRest} 
                                          onChange={e => setEmail(e.target.value)} autoComplete="off"/><br />
                                   </div>
                                   <div className={Style.inputFieldPass}>
                                          <i className="fas fa-key" ></i>      
                                          <input type="password" placeholder="Password..." className={Style.inputRest} 
                                          onChange={e => setPassword(e.target.value)} autoComplete="off"/><br />
                                   </div>
                                   <div className={Style.inputFieldConPass}>
                                          <i className="fas fa-key" ></i>     
                                          <input type="password" placeholder="Confirm Password..." className={Style.inputRest} 
                                          onChange={e => setPasswordMatch(e.target.value)} autoComplete="off"/><br />
                                   </div>
                                   <button type="submit" className={Style.btn} >SIGN UP</button>
                            </form>
                            :<form className={Style.form} onSubmit={uploadUser}>
                                   <div className={Style.inputFieldUser}>
                                          <i className="fas fa-user" ></i>
                                          <input type="username" placeholder="Username..." className={Style.inputUsername} 
                                          onChange={e => setUserName(e.target.value)} autoComplete="off" required/><br />
                                   </div>
                                   <div className={Style.inputFieldMail}>
                                          <i className="fas fa-envelope"></i>
                                          <input pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" type="email" 
                                          placeholder="Email..." className={Style.inputRest} onChange={e => setEmail(e.target.value)} autoComplete="off" required/><br />
                                   </div>
                                   <div className={Style.inputFieldPass}>
                                          <i className="fas fa-key" ></i>      
                                          <input type="password" placeholder="Password..." className={Style.inputRest} 
                                          onChange={e => setPassword(e.target.value)} autoComplete="off" required/><br />
                                   </div>
                                   <div className={Style.inputFieldConPass}>
                                          <i className="fas fa-key" ></i>     
                                          <input type="password" placeholder="Confirm Password..." className={Style.inputRest} 
                                          onChange={e => setPasswordMatch(e.target.value)} autoComplete="off" required/><br />
                                   </div>
                                   { error ? <p className={Style.error} >Password does not match!</p> : null  }
                                   <button type="submit" className={Style.btn} >SIGN UP</button>
                            </form>
                     }
                     <br />
                     { 
                     transition ? 
                            <h4 className={Style.pChange}>Already have an account?<DelayLink delay={700} to='/login'><p className={Style.link} onClick={change}>Sing In</p></DelayLink></h4>
                            :<h4 className={Style.p}>Already have an account?<DelayLink delay={700} to='/login'><p className={Style.link} onClick={change}>Sing In</p></DelayLink></h4>
                     }
              </div>
       )
}

export default Register