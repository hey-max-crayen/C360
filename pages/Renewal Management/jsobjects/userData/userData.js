export default {
   saveUserData() {
       const userName = InputName.selectedOptionValue; // User's name from an input widget
       const userTeam = InputTeam.selectedOptionValue; // User's team from an input widget
       const userMotion = InputMotion.selectedOptionValue; // User's motion from an input widget

       // Speichere die Werte in den lokalen Speicher
       storeValue('userName', userName, true); 
       storeValue('userTeam', userTeam, true); 
       storeValue('userMotion', userMotion, true); 

       // Rückgabe der gespeicherten Werte
       return { 
           name: appsmith.store.userName, 
           team: appsmith.store.userTeam, 
           motion: appsmith.store.userMotion,
       };
   }
}
