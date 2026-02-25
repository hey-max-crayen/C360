export default {
  // Funktion zum Erstellen der ECharts-Optionen
  options() {
    // Den Wert überprüfen und auf 0 setzen, falls keine Zeile ausgewählt ist
    const NBAScore = Account_List.selectedRow?.["Score"] || 0; // Fallback auf 0

    // Prüfen, ob keine Daten vorhanden sind (Wert = 0)
    const isEmpty = NBAScore === 0;

    return {
      title: {
        text: 'C360 Score', // Der Titeltext
        left: 'center', // Positionierung: zentriert
        top: 'top', // Positionierung: oben
        textStyle: {
          fontSize: 18, // Schriftgröße
          fontWeight: 'normal', // Kein Fettschrift (Standard ist 'bold')
          color: '#333' // Farbe des Titels
        }
      },
      series: [
        {
          type: 'gauge',
          center: ['50%', '60%'], // Verschiebt den Graphen nach unten (Standard: ['50%', '50%'])
          axisLine: {
            lineStyle: {
              width: 15, // Reduziert die Dicke des Balkens (Standard ist 30)
              color: isEmpty
                ? [[1, '#e0e0e0']] // Wenn keine Daten, grauer Balken
                : [
                    [0.25, '#22b31e'], // 0-25: Grün
                    [0.75, '#fbbc04'], // 25-75: Gelb
                    [1, '#ea4335']     // 75-100: Rot
                  ]
            }
          },
          pointer: {
            itemStyle: {
              color: isEmpty ? '#e0e0e0' : 'auto' // Grauer Zeiger, wenn keine Daten
            }
          },
          axisTick: {
            show: false, // Achsenticks ausblenden
            distance: -30,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            show: false, // Split-Lines ausblenden
            distance: -30,
            length: 30,
            lineStyle: {
              color: '#fff',
              width: 4
            }
          },
          axisLabel: {
            show: false, // Beschriftung ausblenden
            color: 'inherit',
            distance: 40,
            fontSize: 20
          },
          detail: {
            valueAnimation: true,
            formatter: isEmpty ? '' : '{value}', // Zeigt "Keine Daten", wenn leer
            color: isEmpty ? '#e0e0e0' : 'inherit' // Graue Farbe, wenn keine Daten
          },
          data: [
            {
              value: NBAScore // Wert verwenden (0, wenn keine Zeile ausgewählt)
            }
          ]
        }
      ]
    };
  },
};
