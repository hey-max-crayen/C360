export default {
    removeAccountIdAndRefreshAll: async () => {
        try {
            // 1. Nur navigieren wenn accountId tatsächlich in der URL ist
            if (appsmith.URL.queryParams.accountId) {
                const basePath = appsmith.URL.fullPath.split('?')[0];
                navigateTo(basePath);
                
                // Kurz warten, damit die Navigation abgeschlossen ist
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            // 2. Alle Queries nacheinander ausführen
            await GetAllUsers2.run();
						await GetAccountsSelected2.run();
						await snowplow_main.run();
            await snowplow_chart.run();
            await log.run();
            
            // 3. Config zurücksetzen
            await Config.resetToDefault();
            
            showAlert('Alle Daten neu geladen', 'success');
            
        } catch (error) {
            showAlert('Fehler Laden der Daten: ' + error.message, 'error');
        }
    }
}
