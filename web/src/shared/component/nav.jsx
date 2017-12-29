// @flow

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HOME_PAGE_ROUTE,
  ALL_GAMES_ROUTE,
} from '../routes';

const Nav = () => (
  <nav>
    <ul>
      {[
        { route: HOME_PAGE_ROUTE, label: 'Home' },
        { route: ALL_GAMES_ROUTE, label: 'All Games' },
        { route: '/gloomhaven', label: 'Gloomhaven' },
      ].map(link => (
        <li key={link.route}>
          <NavLink to={link.route} activeStyle={{ color: 'limegreen' }} exact>{link.label}</NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

export default Nav;
