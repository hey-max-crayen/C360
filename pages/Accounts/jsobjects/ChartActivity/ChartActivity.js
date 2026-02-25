export default {
  fetchData() {
    console.log("Original SQL Data: ", snowplow_chart_activity.data); // Debugging

    const records = snowplow_chart_activity.data.filter(
      (p) => p.account_id === Account_List.selectedRow.sf_account_id
    );
    console.log("Filtered Records: ", records);

    if (records.length === 0) {
      console.warn("Keine Daten nach der Filterung!");
      return null;
    }

    // Schritt 2: Alle Wochen direkt aus den SQL-Daten extrahieren
    const allWeeks = [...new Set(records.map((p) => new Date(p.week_date).toISOString().split('T')[0]))]; // Extrahiere eindeutige Wochen aus der Query
    console.log("All Weeks (from SQL): ", allWeeks);

    // Schritt 3: Daten gruppieren und summieren
    const groupedData = records.reduce((acc, p) => {
      const week = new Date(p.week_date).toISOString().split('T')[0]; // Verwende `week_date` im richtigen Format
      if (!acc[week]) {
        acc[week] = {
          weeklyMeetingCount: 0,
          totalCalls: 0,
          callsOver10s: 0,
          callsOver120s: 0,
        };
      }
      acc[week].weeklyMeetingCount += p.weekly_meeting_count || 0;
      acc[week].totalCalls += p.total_calls || 0;
      acc[week].callsOver10s += p.calls_over_10s || 0;
      acc[week].callsOver120s += p.calls_over_120s || 0;
      return acc;
    }, {});
    console.log("Grouped Data: ", groupedData); // Debugging

    // Schritt 4: Alle Wochen sicherstellen und fehlende mit 0 auffüllen
    const result = {
      weeks: allWeeks,
      weeklyMeetingCount: [],
      totalCalls: [],
      callsOver10s: [],
      callsOver120s: [],
    };

    allWeeks.forEach((week) => {
      result.weeklyMeetingCount.push(groupedData[week]?.weeklyMeetingCount || 0);
      result.totalCalls.push(groupedData[week]?.totalCalls || 0);
      result.callsOver10s.push(groupedData[week]?.callsOver10s || 0);
      result.callsOver120s.push(groupedData[week]?.callsOver120s || 0);
    });

    console.log("Final Chart Data: ", result); // Debugging
    return result;
  },

  options() {
    const data = this.fetchData();
    if (!data) {
      return {};
    }

    return {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: [
          "Meetings",
          "Call Attempt",
          "Calls Over 10s",
          "Calls Over 120s",
        ],
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
          data: data.weeks, // Wochen im richtigen Format
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Meetings",
          type: "bar",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          data: data.weeklyMeetingCount,
          itemStyle: {
            color: "#e6af14ff", // Orange
          },
        },
        {
          name: "Call Attempt",
          type: "bar",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          data: data.totalCalls,
          itemStyle: {
            color: "#f5c1d1", // Helles Pink
          },
        },
        {
          name: "Calls Over 10s",
          type: "bar",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          data: data.callsOver10s,
          itemStyle: {
            color: "#e073a6", // Helleres Rosa
          },
        },
        {
          name: "Calls Over 120s",
          type: "bar",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          data: data.callsOver120s,
          itemStyle: {
            color: "#c84182ff", // Rosa
          },
        },
      ],
    };
  },
};
