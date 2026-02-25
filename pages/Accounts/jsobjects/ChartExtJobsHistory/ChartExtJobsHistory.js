export default {
  fetchData() {
    // Erwartete Struktur je Zeile:
    // { d: 'YYYY-MM-DD' oder Date, stepstone__jobs__hierarchy__c: number, indeed__jobs__hierarchy__c: number, company__website__jobs__hierarchy__c: number }
    const rows = snowplow_extjobHistory.data || [];

    if (!rows.length) {
      console.warn("Keine Daten aus stage_jobs_daily!");
      return null;
    }

    // Helper: Datum normalisieren zu YYYY-MM-DD
    const toIsoDate = (dateLike) => {
      const d = new Date(dateLike);
      return d.toISOString().split("T")[0];
    };

    // Nach Tag gruppieren und summieren (falls mehrere Einträge pro Tag)
    const grouped = rows.reduce((acc, r) => {
      const day = toIsoDate(r.d);
      if (!acc[day]) {
        acc[day] = { stepstone: 0, indeed: 0, website: 0 };
      }
      acc[day].stepstone += Number(r.stepstone__jobs__hierarchy__c || 0);
      acc[day].indeed += Number(r.indeed__jobs__hierarchy__c || 0);
      acc[day].website += Number(r.company__website__jobs__hierarchy__c || 0);
      return acc;
    }, {});

    // Alle Tage bestimmen (sortiert)
    const days = [...new Set(rows.map((r) => toIsoDate(r.d)))]
      .sort((a, b) => new Date(a) - new Date(b));

    // Serien aufbauen
    const result = {
      days,
      stepstone: days.map((d) => grouped[d]?.stepstone || 0),
      indeed: days.map((d) => grouped[d]?.indeed || 0),
      website: days.map((d) => grouped[d]?.website || 0),
    };

    return result;
  },

  options() {
	
		
    const data = this.fetchData();
    if (!data) return {};

    return {
      tooltip: { 
        trigger: "axis",
        axisPointer: { type: "cross" }
      },
      legend: { data: ["StepStone Jobs", "Indeed Jobs", "Website Jobs"] },
      grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
      xAxis: [{ 
        type: "category", 
        boundaryGap: false, 
        data: data.days 
      }],
      yAxis: [{ type: "value" }],
      series: [
        {
          name: "StepStone Jobs",
          type: "line",
          smooth: true,
          emphasis: { focus: "series" },
          data: data.stepstone,
          itemStyle: { color: "#e6af14" },
          lineStyle: { color: "#e6af14" },
        },
        {
          name: "Indeed Jobs",
          type: "line",
          smooth: true,
          emphasis: { focus: "series" },
          data: data.indeed,
          itemStyle: { color: "#f5c1d1" },
          lineStyle: { color: "#f5c1d1" },
        },
        {
          name: "Website Jobs",
          type: "line",
          smooth: true,
          emphasis: { focus: "series" },
          data: data.website,
          itemStyle: { color: "#c84182" },
          lineStyle: { color: "#c84182" },
        },
      ],
    };
  },
};
