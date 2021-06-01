import React from 'react'
import './App.css'
import Home from './Pages/Home'
import Profile from './Pages/Profile'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Start from './Pages/Start'
import Camera from './Pages/CameraPage'
import CreatePost from './Pages/CreatePost'
import Post from './Pages/Post'
import Chat from './Pages/Chat'
import LogOut from './Pages/LogOut'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/' component={Start}/>
          <Route path='/login' component={Login}/>
          <Route path='/register' component={Register}/>
          <Route path='/camera' component={Camera}/>            
          <Route path='/createPost' component={CreatePost}/>
          <Route path='/logout' component={LogOut}/>
          <Route path='/chat' component={Chat}/>
          <>
            <Navbar />
            <Route path='/home' component={Home}/>
            <Route path='/profile' component={Profile}/>
            <Route path='/post/:id' component={Post}/>
            <Footer />
          </>
        </Switch>
      </Router>
    </div>
  )
}

export default App
