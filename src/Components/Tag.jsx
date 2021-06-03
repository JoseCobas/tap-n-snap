import React from 'react';
import Style from './CSS/tag.module.scss';
import { Link } from 'react-router-dom';

function Tag({ value }) {

    return (
      <Link to={'/chat/tag/' + value} className={Style.link}>
        <span className={Style.Tag}>{value}</span>
      </Link>
    ) 
}

export default Tag
