export default {
	Select_AccountSearchonFilterUpdate () {
		// Debouncing für bessere Performance
if (this.searchTimeout) {
    clearTimeout(this.searchTimeout);
}

this.searchTimeout = setTimeout(() => {
    if (Select_AccountSearch.filterText && Select_AccountSearch.filterText.length >= 3) {
        account_search.run();
    }
}, 400);

	}
}