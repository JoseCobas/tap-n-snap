import React, { useState, useEffect } from 'react'
import Style from './CSS/searchbar.module.scss'

function Searchbar({newSearch, logSearch}) {
  const [display, setDisplay] = useState(false)

  const checkValue = (e) => {
    const value = document.getElementById("search").value;

    if(value == ""){
      setDisplay(false)
      newSearch(value)
    }else{
      setDisplay(true)
      newSearch(value)
    }
  }

  function removeText() {
    document.getElementById("search").value = "";
    checkValue();
  }

  useEffect(() => checkValue(), [newSearch])

  return (
    <form className={Style.formSection}>
      <input type="search" maxLength="15" name="search" id="search" className={Style.searchBar} placeholder="Search..." onChange={checkValue} autoComplete="off" />
      { display ? <div className={Style.iHelper}><i className="fas fa-times" onClick={removeText}></i></div> : null }
      <button type="button" className={Style.submitButton} onClick={logSearch}>
        <i className="fa fa-search"></i>
      </button>
    </form>
  );
}

export default Searchbar;
