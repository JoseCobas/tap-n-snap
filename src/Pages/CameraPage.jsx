import React from "react";
import Webcam from "react-webcam";
import Style from "./CSS/cameraPage.module.scss";
import { Link } from 'react-router-dom';

const videoConstraints = {
  facingMode: "user",
};

const CameraPage = () => {
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    window.imageSrc = imageSrc;
  }, [webcamRef, setImgSrc]);

  return (
    <div className={Style.wrapper}>
      <Webcam
        class
        mirrored={true}
        ref={webcamRef}
        screenshotFormat="image/jpeg/jpg"
        videoConstraints={videoConstraints}
        audio={false} // mute sound
        // width= {400}
        // height= {1200}
      />
      <div className={Style.buttonContainer}>

        <div className={Style.buttonDiv}>
          {/* {imgSrc && <img className={Style.previewImage} src={imgSrc} />} */}
        </div>
        <Link to="/createPost">
          <button className={Style.cameraButton} onClick={capture}></button>
        </Link>
      </div>
    </div>
  );
};

export default CameraPage;
