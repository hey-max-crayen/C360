export default {
  // Funktion zum Verarbeiten der Daten direkt aus der SQL-Query
  fetchData() {
    // Schritt 1: Hole die Daten direkt aus der SQL-Query
    console.log("Original SQL Data: ", snowplow_chart.data); // Debugging: Zeigt die Daten aus der Query
    const records = snowplow_chart.data.filter(
      (p) => p.company_id === Renewal_List.selectedRow.company_id
    );
    console.log("Filtered Records: ", records); // Debugging: Zeigt die gefilterten Daten

    if (records.length === 0) {
      console.warn("Keine Daten nach der Filterung!"); // Warnung, wenn keine Daten übrig sind
    }

    // Schritt 2: Zeitraum bestimmen (minDate aus Daten, maxDate als aktueller Monat)
    const dates = records.map((p) => new Date(p.month));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(); // Aktueller Monat

    // Schritt 3: Alle Monate zwischen minDate und maxDate generieren
    const allMonths = [];
    let current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    while (current <= maxDate) {
      allMonths.push(
        current.getFullYear() +
          "-" +
          (current.getMonth() + 1).toString().padStart(2, "0")
      );
      current.setMonth(current.getMonth() + 1); // Zum nächsten Monat wechseln
    }

    // Schritt 4: Daten gruppieren und summieren
    const groupedData = records.reduce((acc, p) => {
      const month =
        new Date(p.month).getFullYear() +
        "-" +
        (new Date(p.month).getMonth() + 1).toString().padStart(2, "0");
      if (!acc[month]) {
        acc[month] = { booking: 0, remainingCredits: 0, creditsUsed: 0 };
      }
      acc[month].booking += p.booking || 0; // Summiere die booking-Werte
      acc[month].remainingCredits = p.remaining_total_credit || 0; // Nimm den letzten Wert (keine Summierung)
      acc[month].creditsUsed += p.total_credit_used || 0; // Summiere die credits used
      return acc;
    }, {});

    console.log("Grouped Data: ", groupedData); // Debugging: Zeigt gruppierte Daten

    // Schritt 5: Alle Monate sicherstellen und fehlende mit 0 auffüllen
    const result = {
      months: allMonths,
      booking: [],
      remainingCredits: [],
      creditsUsed: [],
    };

    allMonths.forEach((month) => {
      result.booking.push(groupedData[month]?.booking || 0);
      result.remainingCredits.push(groupedData[month]?.remainingCredits || 0);
      result.creditsUsed.push(
        -(groupedData[month]?.creditsUsed || 0) // Negativ darstellen
      );
    });

    console.log("Final Chart Data: ", result); // Debugging: Zeigt finale Daten für das Chart
    return result;
  },

  // Funktion zum Erstellen der ECharts-Optionen
  options() {
    const data = this.fetchData();

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        data: ["Booking", "Remaining Credits", "Credits Used"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: true,
          data: data.months, // Monate als x-Achse
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Booking",
          type: "bar", // Balken für Booking
          emphasis: {
            focus: "series",
          },
          data: data.booking, // Booking-Daten
          itemStyle: {
            color: "#c84182ff", // Farbe für die Balken
          },
        },
        {
          name: "Remaining Credits",
          type: "line", // Linie mit Fläche
          stack: "Total",
          areaStyle: {
            color: "#ffcbe4ff", // Farbe für die Fläche
            opacity: 0.5,
          },
          emphasis: {
            focus: "series",
          },
          lineStyle: {
            color: "#ffcbe4ff", // Farbe der Linie
          },
          data: data.remainingCredits, // Remaining Credits-Daten
        },
        {
          name: "Credits Used",
          type: "line", // Balken für Credits Used
          emphasis: {
            focus: "series",
          },
          data: data.creditsUsed, // Credits Used-Daten
          itemStyle: {
            color: "#e6af14ff", // Neue Farbe für die Balken
          },
        },
      ],
    };
  },
};
