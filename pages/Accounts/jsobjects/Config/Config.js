export default {
  saveConfig() {
    // Spezifische Widgets für alle 8 Metriken
    const metricConfig = [
      { 
        value: InputVar1.value, 
        min: InputVar1Min.value, 
        max: InputVar1Max.value, 
        trigger: InputVar1Trigger.isChecked // Checkbox-Wert hinzufügen
      },
      { 
        value: InputVar2.value, 
        min: InputVar2Min.value, 
        max: InputVar2Max.value, 
        trigger: InputVar2Trigger.isChecked 
      },
      { 
        value: InputVar3.value, 
        min: InputVar3Min.value, 
        max: InputVar3Max.value, 
        trigger: InputVar3Trigger.isChecked 
      },
      { 
        value: InputVar4.value, 
        min: InputVar4Min.value, 
        max: InputVar4Max.value, 
        trigger: InputVar4Trigger.isChecked 
      },
      { 
        value: InputVar5.value, 
        min: InputVar5Min.value, 
        max: InputVar5Max.value, 
        trigger: InputVar5Trigger.isChecked 
      },
      { 
        value: InputVar6.value, 
        min: InputVar6Min.value, 
        max: InputVar6Max.value, 
        trigger: InputVar6Trigger.isChecked 
      },
      { 
        value: InputVar7.value, 
        min: InputVar7Min.value, 
        max: InputVar7Max.value, 
        trigger: InputVar7Trigger.isChecked 
      },
      { 
        value: InputVar8.value, 
        min: InputVar8Min.value, 
        max: InputVar8Max.value, 
        trigger: InputVar8Trigger.isChecked 
      },
    ];

    // Werte im Store speichern
    metricConfig.forEach((metric, index) => {
      const metricIndex = index + 1; // 1-basiert
      storeValue(`InputVar${metricIndex}`, metric.value, true);
      storeValue(`InputVar${metricIndex}Min`, metric.min, true);
      storeValue(`InputVar${metricIndex}Max`, metric.max, true);
      storeValue(`InputVar${metricIndex}Trigger`, metric.trigger, true); // Checkbox-Wert speichern
    });

    // Rückgabe der gespeicherten Werte
    const storedValues = {};
    metricConfig.forEach((_, index) => {
      const metricIndex = index + 1;
      storedValues[`InputVar${metricIndex}`] = appsmith.store[`InputVar${metricIndex}`];
      storedValues[`InputVar${metricIndex}Min`] = appsmith.store[`InputVar${metricIndex}Min`];
      storedValues[`InputVar${metricIndex}Max`] = appsmith.store[`InputVar${metricIndex}Max`];
      storedValues[`InputVar${metricIndex}Trigger`] = appsmith.store[`InputVar${metricIndex}Trigger`]; // Checkbox-Wert hinzufügen
    });

    console.log("Gespeicherte Werte:", storedValues);
    return storedValues; // Rückgabe aller gespeicherten Werte
  },

  filterAccountList: async () => {
    try {
      // Originaldaten aus der API snowplow_NBAbyOwner abrufen
      const accounts = snowplow_main_old.data;

      // Werte aus den Filter-Widgets abrufen
      const motionFilter = InputMotion.selectedOptionValue?.trim().toLowerCase(); // Filter für acc_owner
      const teamFilter = InputTeam.selectedOptionValue?.trim().toLowerCase(); // Filter für acc_manager
      const nameFilter = InputName.selectedOptionValue?.trim().toLowerCase(); // Filter für name

      // Kopie der Account-Liste für die Filterung erstellen
      let filteredAccounts = accounts;

      // Filter für acc_owner (Motion)
      if (motionFilter) {
        filteredAccounts = filteredAccounts.filter(account =>
          account.acc_owner?.toLowerCase().includes(motionFilter)
        );
      }

      // Filter für acc_manager (Team)
      if (teamFilter) {
        filteredAccounts = filteredAccounts.filter(account =>
          account.acc_manager?.toLowerCase().includes(teamFilter)
        );
      }

      // Filter für name (Name)
      if (nameFilter) {
        filteredAccounts = filteredAccounts.filter(account =>
          account.name?.toLowerCase().includes(nameFilter)
        );
      }

      // Gefilterte Daten zurückgeben
      return filteredAccounts;
    } catch (error) {
      console.error("Error filtering snowplow_NBAbyOwner.data:", error);
      return [];
    }
  },

  resetToDefault() {
    // Standardwerte definieren für "Inside Sales" und "Other"
    const defaults = {
      insideSales: [
        { value: 20, min: 0, max: 90, trigger: false },  // Standardwerte für InputVar1
        { value: 50, min: 0, max: 90, trigger: false },   // Standardwerte für InputVar2
        { value: 30, min: 0, max: 30, trigger: false }, // Standardwerte für InputVar3
        { value: 0, min: 1, max: 0, trigger: false }, // Standardwerte für InputVar4
        { value: 0, min: 0, max: 0, trigger: false },// Standardwerte für InputVar5
        { value: 0, min: 0, max: 0, trigger: false }, // Standardwerte für InputVar6
        { value: 0, min: 0, max: 0, trigger: false },// Standardwerte für InputVar7
        { value: 0, min: 0, max: 0, trigger: false }, // Standardwerte für InputVar8
      ],
      other: [
        { value: 50, min: 0, max: 90, trigger: true },  // Standardwerte für InputVar1
        { value: 10, min: 0, max: 90, trigger: false },   // Standardwerte für InputVar2
        { value: 20, min: 0, max: 30, trigger: false }, // Standardwerte für InputVar3
        { value: 20, min: 1, max: 0, trigger: true }, // Standardwerte für InputVar4
        { value: 0, min: 0, max: 0, trigger: false },// Standardwerte für InputVar5
        { value: 0, min: 0, max: 0, trigger: false }, // Standardwerte für InputVar6
        { value: 0, min: 0, max: 0, trigger: false },// Standardwerte für InputVar7
        { value: 0, min: 0, max: 0, trigger: false }, // Standardwerte für InputVar8
    ],
    subscriptionNewBusiness: [
      { value: 20, min: 0, max: 90, trigger: false },  // Standardwerte für InputVar1
      { value: 50, min: 0, max: 90, trigger: false },   // Standardwerte für InputVar2
      { value: 30, min: 0, max: 30, trigger: false }, // Standardwerte für InputVar3
      { value: 0, min: 1, max: 0, trigger: true }, // Standardwerte für InputVar4
      { value: 0, min: 0, max: 0, trigger: false },// Standardwerte für InputVar5
      { value: 0, min: 0, max: 0, trigger: false }, // Standardwerte für InputVar6
      { value: 0, min: 0, max: 0, trigger: false },// Standardwerte für InputVar7
      { value: 0, min: 0, max: 0, trigger: false }, // Standardwerte für InputVar8
    ],
    subscriptionProspection: [
      { value: 20, min: 0, max: 90, trigger: false },  // Standardwerte für InputVar1
      { value: 50, min: 0, max: 90, trigger: false },   // Standardwerte für InputVar2
      { value: 30, min: 0, max: 30, trigger: false }, // Standardwerte für InputVar3
      { value: 0, min: 1, max: 0, trigger: true }, // Standardwerte für InputVar4
      { value: 0, min: 0, max: 0, trigger: false },// Standardwerte für InputVar5
      { value: 0, min: 0, max: 0, trigger: false }, // Standardwerte für InputVar6
      { value: 0, min: 0, max: 0, trigger: false },// Standardwerte für InputVar7
      { value: 0, min: 0, max: 0, trigger: false }, // Standardwerte für InputVar8
    ]
  };

    // Aktuellen Wert von appsmith.store.userMotion abrufen
    const userMotion = appsmith.store.userMotion;

    // Standardwerte auswählen basierend auf userMotion
  const defaultConfig = 
    userMotion === "Inside Sales" ? defaults.insideSales : 
    userMotion === "Subscription New Business" ? defaults.subscriptionNewBusiness : 
		userMotion === "Subscription Prospecting" ? defaults.subscriptionProspection : 
    defaults.other;

    // Sicherstellen, dass defaultConfig existiert
    if (!defaultConfig) {
      console.error("Keine Standardwerte gefunden für userMotion:", userMotion);
      return;
    }

    // Werte im Store aktualisieren
    defaultConfig.forEach((metric, index) => {
      const metricIndex = index + 1; // 1-basiert
      storeValue(`InputVar${metricIndex}`, metric.value, true);
      storeValue(`InputVar${metricIndex}Min`, metric.min, true);
      storeValue(`InputVar${metricIndex}Max`, metric.max, true);
      storeValue(`InputVar${metricIndex}Trigger`, metric.trigger, true); // Checkbox-Wert speichern
    });

    console.log(`Standardwerte zurückgesetzt für ${userMotion}:`, defaultConfig);
  }
};
