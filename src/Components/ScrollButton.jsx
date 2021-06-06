import React, {useState, useEffect} from 'react';
import Style from './CSS/footer.module.scss'

//A scroll-to-top-btn appears on the footer (navbar) when the user has scrolled 200px or more of content.
  
const ScrollButton = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let mounted = true
    var toggleVisible = document.addEventListener("scroll", e => {
      if (mounted) {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 200){
          setVisible(true)
        } 
        else if (scrolled <= 200){
          setVisible(false)
        }
      }
    })

    return () => {
      document.removeEventListener("scroll", toggleVisible)
      mounted = false
    }
  }, [visible])
  
  const scrollToTop = () => {
    if (visible == true){
      window.scrollTo({
        top: 0, 
        behavior: 'smooth'
      });
    }else {
      console.log("No action until scroll");
    }
  };
  
  return (
    <button className={`${ visible ? Style.scrollBtn : Style.scrollBtnHide}`} onClick={scrollToTop}>
      <i className="fas fa-chevron-up"></i>
    </button>
  );
}
  
export default ScrollButton;