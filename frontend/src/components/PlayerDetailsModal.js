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

      // Calcola i valori medi per ogni macro categoria
      const macroCategories = {
        'Capacità Tecnica': [
          player.controlloPalla,
          player.dribbling,
          player.precisionePassaggi,
          player.tiro,
        ],
        'Resistenza Fisica': [
          player.stamina,
          player.velocità,
          player.resistenzaSforzo,
        ],
        'Posizionamento Tattico': [
          player.anticipazione,
          player.copertura,
          player.adattabilitaTattica,
        ],
        'Capacità Difensiva': [
          player.contrasto,
          player.intercettazioni,
          player.coperturaSpazi,
        ],
        'Contributo in Attacco': [
          player.creativita,
          player.movimentoSenzaPalla,
          player.finalizzazione,
        ],
        'Mentalità e Comportamento': [
          player.leadership,
          player.gestioneStress,
          player.sportivita,
        ],
      };

      const macroCategoryLabels = Object.keys(macroCategories);
      const macroCategoryValues = macroCategoryLabels.map(
        (category) =>
          macroCategories[category].reduce((a, b) => a + b, 0) /
          macroCategories[category].length // Media dei valori
      );

      chartInstanceRef.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: macroCategoryLabels,
          datasets: [
            {
              label: `${player.name} - Valutazione`,
              data: macroCategoryValues,
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
        top: '50%', // Allinea verticalmente al centro
        left: '110%', // Accanto al nome
        transform: 'translateY(-50%)',
        zIndex: 1050,
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
        width: '400px', // Dimensioni fisse per mostrare tutto
        height: '400px',
        overflow: 'hidden',
      }}
    >
      <div className="modal-header">
        <h5 className="modal-title">Dettagli di {player.name}</h5>
      </div>
      <div className="modal-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <canvas ref={chartRef} width="300" height="300"></canvas>
      </div>
    </div>
  );
}

export default PlayerDetailsModal;
