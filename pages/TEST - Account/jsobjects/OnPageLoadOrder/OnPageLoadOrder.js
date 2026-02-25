export default {
  runQueries: () => {
    GetAllUsers2.run()
      .then(response => {
        showAlert("1/3: Salesforce-Daten erfolgreich geladen", "success");
        return snowplow_main.run();
      })
		  .then(response => {
        return log.run();
      })
		  .then(response => {
        return GetAccountsSelected2.run();
      })
      .then(response => {
        showAlert("2/3: Backend-Daten erfolgreich geladen", "success");
        return snowplow_chart.run();
      })
      .then(response => {
        return GetJobs2.run();
      })
      .then(response => {
        showAlert("3/3 Alles erfolgreich geladen 🥳", "success");
      })
      .catch(error => {
        console.error("Error:", error);
        showAlert("Es ist ein Fehler aufgetreten: " + error.message, "error");
      });
  }
};
