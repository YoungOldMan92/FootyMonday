import React, { useEffect, useRef } from 'react';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

function PlayerDetailsModal({ player, onMouseEnter, onMouseLeave }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (player) {
      const ctx = chartRef.current.getContext('2d');
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Attacco', 'Difesa', 'Tecnica', 'Resistenza', 'Velocità'],
          datasets: [
            {
              label: `${player.name} - Valori`,
              data: [
                player.attack,
                player.defense,
                player.technique,
                player.stamina,
                player.speed,
              ],
              backgroundColor: 'rgba(0, 123, 255, 0.4)',
              borderColor: 'rgba(0, 123, 255, 1)',
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            r: {
              ticks: {
                beginAtZero: false,
                min: 1,
                max: 10,
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [player]);

  if (!player) return null;

  return (
    <div
      className="modal d-block fade-in"
      tabIndex="-1"
      role="dialog"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -20%)',
        zIndex: 1050,
        backgroundColor: 'white',
        border: '1px solid rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        padding: '20px', // Più spazio interno
        width: '500px', // Larghezza fissa più grande
        height: '500px', // Altezza fissa più grande
        overflow: 'hidden', // Impedisce lo scrolling
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="modal-header">
        <h5 className="modal-title">Dettagli di {player.name}</h5>
      </div>
      <div className="modal-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <canvas ref={chartRef} width="400" height="400"></canvas>
      </div>
    </div>
  );
  
}

export default PlayerDetailsModal;
