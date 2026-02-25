export default {
	Input_AccountSearchonTextChanged () {
		//	write code here
		
		// Debouncing - nur alle 500ms suchen
if (this.searchTimeout) {
    clearTimeout(this.searchTimeout);
}

this.searchTimeout = setTimeout(() => {
    if (Input_AccountSearch.text && Input_AccountSearch.text.length >= 3) {
        account_search.run();
    }
}, 500);

	}
}