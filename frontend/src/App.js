import React from 'react';
import TotalVisual from './components/TotalVisual';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styles from './App.module.css';

const NavBar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  return (
    <nav className={styles.nav}>
      <h1 className={styles.title}>
        Visualization Tool for Energy Displacement of Electron Delocalization
      </h1>
      <div className={styles.navLinks}>
        <Link to="/PNDIT" className={`${styles.navLink} ${isActive('/PNDIT')}`}>PNDIT</Link>
        <Link to="/P3HT" className={`${styles.navLink} ${isActive('/P3HT')}`}>P3HT</Link>
        <Link to="/PTB7FOUT" className={`${styles.navLink} ${isActive('/PTB7FOUT')}`}>PTB7FOUT</Link>
        <Link to="/PTB7FIN" className={`${styles.navLink} ${isActive('/PTB7FIN')}`}>PTB7FIN</Link>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className={styles.container}>
        <NavBar />
        <Routes>
          <Route path="/PNDIT" element={<TotalVisual molecule={'PNDIT'} />} />
          <Route path="/P3HT" element={<TotalVisual molecule={'P3HT'} />} />
          <Route path="/PTB7FOUT" element={<TotalVisual molecule={'PTB7FOUT'} />} />
          <Route path="/PTB7FIN" element={<TotalVisual molecule={'PTB7FIN'} />} />
          <Route path="*" element={<TotalVisual molecule={'PNDIT'} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
