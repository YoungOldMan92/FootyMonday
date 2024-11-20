import React, { useEffect, useRef } from 'react';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

function PlayerRadarChart({ player }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const defaultData = [0, 0, 0, 0, 0, 0]; // Valori di default per il grafico vuoto
    const macroCategories = player
      ? {
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
        }
      : {};

    const macroCategoryLabels = Object.keys(macroCategories);
    const macroCategoryValues = macroCategoryLabels.length
      ? macroCategoryLabels.map(
          (category) =>
            macroCategories[category]?.reduce((a, b) => a + b, 0) /
              macroCategories[category]?.length || 0
        )
      : defaultData;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: macroCategoryLabels.length
          ? macroCategoryLabels
          : ['Capacità Tecnica', 'Resistenza Fisica', 'Posizionamento Tattico', 'Capacità Difensiva', 'Contributo in Attacco', 'Mentalità e Comportamento'],
        datasets: [
          {
            label: player ? `${player.name} - Valutazione` : 'Nessun giocatore selezionato',
            data: macroCategoryValues,
            backgroundColor: 'rgba(0, 123, 255, 0.4)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }, [player]);

  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>{player ? player.name : 'Nessun giocatore selezionato'}</h3>
      <canvas ref={chartRef} width="400" height="400"></canvas>
    </div>
  );
}

export default PlayerRadarChart;
