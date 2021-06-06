import React from "react";
import Webcam from "react-webcam";
import Style from "./CSS/cameraPage.module.scss";
import {Link} from 'react-router-dom';

const videoConstraints = {
  facingMode: "user",
};

const CameraPage = () => {
  const webcamRef = React.useRef(null);
  
  // Take picture and store it for use on another page
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    window.imageSrc = imageSrc;
  }, [webcamRef]);
  
  return (
    <div className={Style.wrapper}>
      <Webcam
        mirrored={true}
        ref={webcamRef}
        screenshotFormat="image/jpeg/jpg"
        videoConstraints={videoConstraints}
        audio={false} // mute sound
      />
      <div className={Style.buttonContainer}>
        <div className={Style.buttonDiv}>
          <Link to="/createPost">
            <button className={Style.cameraButton} onClick={capture}></button>
          </Link>
          <Link to="/home" className={Style.iHelper}>
            <i className="fas fa-chevron-left"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
