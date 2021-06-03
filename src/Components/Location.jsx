import React from 'react';
import Style from './CSS/location.module.scss';
import { Link } from 'react-router-dom';

function Location({ value }) {

    return (
      <Link to={'/chat/location/' + value} className={Style.link}>
        <p className={Style.Location}>
          {value} <i className="fa fa-map-marker" aria-hidden="true"></i>
        </p>
      </Link>
    ) 
}

export default Location

