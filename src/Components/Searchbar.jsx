import React from 'react'
import Style from './CSS/searchbar.module.scss'

const Searchbar = ({ search, searchValue, setSearchValue }) => {

  const submitHandler = e => {
    e.preventDefault();
    search();
  }

  const clearSearchHandler = () => {
    setSearchValue(''); 
    search();
  }

  return (
    <form className={Style.formSection} 
      onSubmit={submitHandler}>
      <input type="search" 
        maxLength="15" 
        name="search" 
        id="search" 
        className={Style.searchBar} 
        placeholder="Search..." 
        onChange={e => setSearchValue(e.target.value)} 
        value={searchValue} 
        autoComplete="off" />
        { 
          searchValue.length ? 
            <div className={Style.iHelper}>
              <i className="fas fa-times" onClick={clearSearchHandler}></i>
            </div> : null 
        }
      <button type="submit" className={Style.submitButton}>
        <i className="fa fa-search"></i>
      </button>
  </form>
  )
}

export default Searchbar;
