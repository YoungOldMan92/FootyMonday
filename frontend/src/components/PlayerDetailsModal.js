import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import config from '../config';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

function PlayerDetailsModal({ playerName, onMouseEnter, onMouseLeave }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playerName) {
      // Effettua la chiamata API per ottenere i dettagli del giocatore
      setLoading(true);
      axios
        .get(`${config.apiBaseUrl}/players/${playerName}`)
        .then((response) => {
          setPlayer(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Errore durante il caricamento del giocatore:", err);
          setLoading(false);
        });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [playerName]);

  useEffect(() => {
    if (player && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const macroCategories = {
        'Capacità Tecnica': [
          player.capacitaTecnica.controlloPalla || 0,
          player.capacitaTecnica.dribbling || 0,
          player.capacitaTecnica.precisionePassaggi || 0,
          player.capacitaTecnica.tiro || 0,
        ],
        'Resistenza Fisica': [
          player.resistenzaFisica.stamina || 0,
          player.resistenzaFisica.velocita || 0,
          player.resistenzaFisica.resistenzaSforzo || 0,
        ],
        'Posizionamento Tattico': [
          player.posizionamentoTattico.anticipazione || 0,
          player.posizionamentoTattico.copertura || 0,
          player.posizionamentoTattico.adattabilitaTattica || 0,
        ],
        'Capacità Difensiva': [
          player.capacitaDifensiva.contrasto || 0,
          player.capacitaDifensiva.intercettazioni || 0,
          player.capacitaDifensiva.coperturaSpazi || 0,
        ],
        'Contributo in Attacco': [
          player.contributoInAttacco.creativita || 0,
          player.contributoInAttacco.movimentoSenzaPalla || 0,
          player.contributoInAttacco.finalizzazione || 0,
        ],
        'Mentalità e Comportamento': [
          player.mentalitaEComportamento.leadership || 0,
          player.mentalitaEComportamento.gestioneStress || 0,
          player.mentalitaEComportamento.sportivita || 0,
        ],
      };

      const macroCategoryLabels = Object.keys(macroCategories);
      const macroCategoryValues = macroCategoryLabels.map(
        (category) =>
          macroCategories[category].reduce((a, b) => a + b, 0) /
          macroCategories[category].length
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
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: true,
            },
          },
          scales: {
            r: {
              min: 0,
              max: 10,
              ticks: {
                stepSize: 1,
              },
              angleLines: {
                color: 'rgba(0,0,0,0.2)',
              },
              grid: {
                color: 'rgba(0,0,0,0.1)',
              },
              pointLabels: {
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      });
    }
  }, [player]);

  if (!playerName) return null;

  return (
    <div
      className="modal d-block fade-in"
      tabIndex="-1"
      role="dialog"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        top: '50%',
        left: '110%',
        transform: 'translateY(-50%)',
        zIndex: 1050,
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
        width: '400px',
        height: '450px',
        overflow: 'hidden',
      }}
    >
      <div className="modal-header">
        <h5 className="modal-title">
          {loading ? 'Caricamento...' : `Dettagli di ${player.name}`}
        </h5>
      </div>
      <div
        className="modal-body"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {loading ? (
          <p>Caricamento dati...</p>
        ) : (
          <canvas ref={chartRef} width="300" height="300"></canvas>
        )}
      </div>
    </div>
  );
}

export default PlayerDetailsModal;
