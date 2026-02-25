export default {
  runQueries: () => {
    GetAllUsers2.run()
      .then(response => {
        showAlert("1/3: Salesforce-Daten erfolgreich geladen", "success");
        
        // Prüfen ob userTeam leer ist
        const hasUserTeam = appsmith.store.userTeam && appsmith.store.userTeam.length > 0;
        
        if (!hasUserTeam) {
          showAlert("Bitte Team und User (optional) auswählen", "info");
          return Promise.resolve();
        }
        
        // Chain für alle anderen Queries wenn userTeam vorhanden
        return snowplow_main2.run()
          .then(() => log.run())
          .then(() => GetAccounts2.run())
          .then(() => {
            showAlert("2/3: Backend-Daten erfolgreich geladen", "success");
            return snowplow_chart.run();
          })
          .then(() => GetJobs2.run())
          .then(() => {
            showAlert("3/3 Alles erfolgreich geladen 🥳", "success");
          });
      })
      .catch(error => {
        console.error("Error:", error);
        showAlert("Es ist ein Fehler aufgetreten: " + error.message, "error");
      });
  }
};
