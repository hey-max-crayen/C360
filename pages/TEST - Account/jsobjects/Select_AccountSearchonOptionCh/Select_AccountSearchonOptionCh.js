export default {
	Select_AccountSearchonOptionChange () {
		// Zur URL mit der gewählten Account ID navigieren
const selectedAccountId = Select_AccountSearch.selectedOptionValue;
if (selectedAccountId) {
    const currentPath = appsmith.URL.fullPath.split('?')[0];
    navigateTo(currentPath + '?accountId=' + selectedAccountId);
}

	}
}