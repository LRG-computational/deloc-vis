import React, { useEffect, useState, useCallback } from 'react';
import Plotly from 'plotly.js';
import './Plot.css';
import { fetchPlotData } from '../../utils/api';

function Plot({molecule, allPhis, Phi, onPointClick, currentTheta, filePath, overlayPlots, overlayMode}) {
  const [plotData, setPlotData] = useState();
  const [highlightedPoint, setHighlightedPoint] = useState(null);

  // Fetch plot data
  useEffect(() => {
    if (filePath) {
      fetchPlotData(filePath)
        .then(data => {
          console.log('Fetched plot data:', data);
          setPlotData(data);
        })
        .catch(error => console.error('Error fetching plot data:', error));
    }
  }, [filePath]);

  // Create resize handler
  const createResizeHandler = useCallback((plotDivId) => {
    return () => {
      const plotDiv = document.getElementById(plotDivId);
      if (plotDiv) {
        Plotly.Plots.resize(plotDiv);
      }
    };
  }, []);

  useEffect(() => {
    const plotDivId = "plot" + (allPhis ? 'All' : Phi);
    let plotElement = null;
    let resizeHandler = null;
    
    // Cleanup function
    const cleanup = () => {
      const plotDiv = document.getElementById(plotDivId);
      if (plotDiv) {
        if (plotElement) {
          plotElement.removeAllListeners();
        }
        if (resizeHandler) {
          window.removeEventListener('resize', resizeHandler);
        }
        try {
          Plotly.purge(plotDiv);
        } catch (e) {
          console.warn('Failed to purge plot:', e);
        }
      }
    };

    // Clean up any existing plot
    cleanup();

    if (plotData != null) {
      // Create new plot
      const traces = [];
      const processPhi = (phiValue) => {
        const E_delocs = [];
        const Thetas = [];
        
        plotData.forEach(item => {
          if (item.Phi === phiValue) {
            E_delocs.push(item.E_deloc);
            Thetas.push(item.Theta);
          }
        });

        const trace = {
          type: 'scatter',
          mode: 'lines+markers',
          name: `Phi = ${phiValue}`,
          x: Thetas,
          y: E_delocs,
          marker: { size: 10 }
        };
        traces.push(trace);
      };

      if (overlayMode) {
        overlayPlots.forEach(phiValue => {
          processPhi(phiValue);
        });      
      } else if (Phi != null) {
        processPhi(Phi);
      } else if(Phi === null){
        allPhis.forEach(phiValue => {
          processPhi(phiValue);
        });
      } 

      if (currentTheta !== null) {
        const currentThetaIndex = plotData.findIndex(item => item.Theta === currentTheta && item.Phi === Phi);
        if (currentThetaIndex !== -1) {
          const currentThetaPoint = plotData[currentThetaIndex];
          const currentThetaTrace = {
            type: 'scatter',
            mode: 'markers',
            name: 'Simulation',
            x: [currentThetaPoint.Theta],
            y: [currentThetaPoint.E_deloc],
            marker: { color: 'green', size: 12 }
          };
          traces.push(currentThetaTrace);
        }
      }

      if (highlightedPoint) {
        const highlightTrace = {
          type: 'scatter',
          mode: 'markers',
          name: 'Last Clicked',
          x: [highlightedPoint.theta],
          y: [highlightedPoint.E_deloc],
          marker: { color: 'red', size: 12 }
        };
        traces.push(highlightTrace);
      }

      let rangeValues;
      if(molecule === 'P3HT'){
        //rangeValues = [1.098, 1.107];
      }
      if(molecule === 'PTB7FIN'){
        //rangeValues = [1.04, 1.065];
      }
      if(molecule === 'PTB7FOUT'){
        //rangeValues = [1.04, 1.065];
      }
      if(molecule ==='PNDIT'){
        //rangeValues = [1.04, 1.065];
      }

      const layout = {
        title: 'Interactive Plot' + (allPhis ? ' for all Phi Values' : ' for Phi = ' + Phi),
        xaxis: {
          title: 'Theta (deg)',
          titlefont: { size: 12 },
          tickfont: { size: 10 }
        },
        yaxis: {
          title: 'Delocalization energy (kcal/mol)',
          range: rangeValues,
          titlefont: { size: 12 },
          tickfont: { size: 10 }
        },
        margin: {
          l: 60,
          r: 10,
          t: 90,
          b: 50
        },
        autosize: true,
        responsive: true,
        useResizeHandler: true
      };

      const config = {
        displayModeBar: true,
        responsive: true,
        scrollZoom: true
      };

      const plotDiv = document.getElementById(plotDivId);
      if (plotDiv) {
        Plotly.newPlot(plotDiv, traces, layout, config).then(() => {
          // Add resize handler after plot is created
          resizeHandler = createResizeHandler(plotDivId);
          window.addEventListener('resize', resizeHandler);
          
          if (!allPhis) {
            plotElement = plotDiv;
            const clickHandler = (data) => {
              const thetaValue = data.points[0].x;
              const E_delocValue = data.points[0].y;
              setHighlightedPoint({ theta: thetaValue, E_deloc: E_delocValue });
              onPointClick(thetaValue);
            };
            plotElement.on('plotly_click', clickHandler);
          }
        });
      }
    }

    // Return cleanup function for component unmount
    return cleanup;
  }, [plotData, Phi, allPhis, onPointClick, highlightedPoint, currentTheta, filePath, molecule, overlayMode, overlayPlots, createResizeHandler]);

  return (
    <>
      <div className="plot-container">
        <div id={"plot" + (allPhis ? 'All' : Phi)} style={{ width: '100%', height: '100%' }}></div>
      </div>
      {!allPhis && !overlayMode && (
        <div className="slider-container">
          <input
            type="range"
            min="0"
            max="350"
            step="10"
            value={currentTheta || 0}
            onChange={(e) => onPointClick(parseInt(e.target.value))}
          />
          <div className="slider-label">
            Theta: {currentTheta || 0}°
          </div>
        </div>
      )}
    </>
  );
}

export default Plot;
