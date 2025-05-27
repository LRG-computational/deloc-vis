import React from 'react';
import styles from './Instructions.module.css';

const Instructions = () => {
  return (
    <div className={styles.instructions}>
      <h3 className={styles.title}>Features</h3>
      <div className={styles.content}>
        <ul>
          <li>Graph displays changes in energy due to electron delocalization based on changes the amount the polymer is bent</li>
          <li>Clicking on the different Phi values will change the graph to show the electron delocalization based on changes in Theta at the specific Phi value</li>
          <li>Clicking on any point on the graphs will display a Methylthiophene with the bends and torsions for the specified value of Phi and Theta</li>
          <li>In standard view, you can toggle the HOMO isosurface on/off</li>
          <li>You can switch between standard view (molecule with optional HOMO) and delocalization view</li>
          <li>The simulation controls work in both views to show the bending and torsion of the polymer</li>
          <li>Other features for the molecule include the ability to drag, zoom-in, and zoom-out</li>
        </ul>
        <h5> Webapp by Shruti Bhamidipati and Robert Ramji</h5>
      </div>
    </div>
  );
};

export default Instructions;