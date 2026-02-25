export default {
  // Bestehende NBAScore-Funktion bleibt unverändert
  NBAScore: function (...vars) {
    console.log("Input Values:", vars);
    try {
      let weightedScore = 0;
      let totalWeight = 0;

      const metrics = vars.map((value, index) => {
        const metricIndex = index + 1;
        return {
          value: value,
          min: appsmith.store[`InputVar${metricIndex}Min`],
          max: appsmith.store[`InputVar${metricIndex}Max`],
          weight: (Number(appsmith.store[`InputVar${metricIndex}`]) || 0) / 100,
          trigger: appsmith.store[`InputVar${metricIndex}Trigger`] || false,
        };
      });

      for (let index = 0; index < metrics.length; index++) {
        const metric = metrics[index];
        if (metric.value == null || metric.value === "") {
          console.log(`Skipping Metric ${index + 1}: No value provided.`);
          continue;
        }

        if (metric.trigger && metric.max > metric.min && metric.value > metric.max) {
          console.log(`Metric ${index + 1} triggered killer criterion. Setting final score to 100.`);
          return 100;
        }

        if (metric.trigger && metric.min > metric.max && metric.value < metric.max) {
          console.log(`Metric ${index + 1} triggered killer criterion. Setting final score to 100.`);
          return 100;
        }

        const metricScore = this.calculateMetricScore(metric.value, metric.min, metric.max);
        console.log(`Score for Metric ${index + 1}:`, metricScore);

        if (metric.weight > 0) {
          weightedScore += metricScore * metric.weight;
          totalWeight += metric.weight;
        }
      }

      if (totalWeight === 0) {
        console.log("No valid metrics or weights provided.");
        return 0;
      }

      const finalScore = Math.floor((weightedScore / totalWeight) * 100);
      console.log("Final NBA Score:", finalScore);
      return finalScore;
    } catch (error) {
      console.error("Error in NBAScore:", error);
      return 0;
    }
  },

  // Bestehende calculateMetricScore bleibt unverändert
  calculateMetricScore: function (value, min, max) {
    if (value == null || value === "") {
      console.log("No value provided. Skipping this metric.");
      return 0;
    }
    if (min == null || min === "" || max == null || max === "") {
      console.log("Invalid min/max values. Using default score of 0.5.");
      return 0.5;
    }

    value = Number(value);
    min = Number(min);
    max = Number(max);

    if (max > min) {
      if (value <= min) return 0;
      if (value >= max) return 1;
      return (value - min) / (max - min);
    } else {
      if (value >= min) return 0;
      if (value <= max) return 1;
      return (min - value) / (min - max);
    }
  },

  // Neue Methode: Score + Farbe berechnen (mit Zugriff auf currentRow und Records)
  getScoreAndColor: function (currentRow, records) {
    // Extrahiere die Werte aus currentRow
    const daysSinceLastRev = currentRow.days_since_last_rev_generated;
    const daysSinceLastMeeting = currentRow.days_since_last_meeting_or_call;
    const totalLiveJobs = currentRow.total__live__jobs__c;

    // Finde das passende Record aus records
    const followUpDate = records.find(
      (record) => record.Id.trim() === currentRow.sf_account_id.trim()
    )?.Follow_up_Date_Account__c;

    // Berechne die Differenz in Tagen
    const followUpDays = followUpDate
      ? moment(followUpDate).diff(moment(), "days")
      : "";

    // Berechne den Score
    const score = this.NBAScore(
      daysSinceLastRev,
      daysSinceLastMeeting,
      totalLiveJobs,
      followUpDays
    );

    // Bestimme die Farbe basierend auf dem Score
    let color;
    if (score >= 75) {
      color = "#ea4335"; // Rot
    } else if (score <= 25) {
      color = "#22b31e"; // Grün
    } else {
      color = "#fbbc04"; // Orange
    }

    // Rückgabe von Score und Farbe
    return { score, color };
  },
};
