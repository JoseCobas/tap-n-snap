import React from 'react'
import Style from './CSS/footer.module.scss'
import ScrollButton from '../Components/ScrollButton'
import { Link } from 'react-router-dom'

var cameraIcon = "";
var imageIcon = "";


const Footer = ({ cameraBtn, imageBtn }) => {

    
    if (cameraBtn == true)
        cameraIcon =  <i className="fas fa-camera fa-3x"></i>
    else 
        cameraIcon = ""
    

    if (imageBtn == true)
        imageIcon = <i className="fas fa-image fa-3x"></i>
    else 
        imageIcon = ""
    return (

        <div className={Style.footer}>
            <div className={Style.iconContainer}>
                <Link className={Style.camera} to="/camera">{cameraIcon}</Link>
                <a className={Style.imageUpload} href="/">{imageIcon}</a>
            </div>
            <ScrollButton/>

        </div>
        
 
    )
}

export default Footer




