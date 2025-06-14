import React from 'react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header style={styles.header}>
      <Link to="/">
        <img src={logo} alt="Logo" style={styles.logo} />
      </Link>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#303030',
    textAlign: 'center',
  },
};
