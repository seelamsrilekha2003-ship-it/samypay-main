const MOCK_STATS = {
	totalRecharges: 1245,
	todayRecharges: 34,
	walletBalance: 1970199.69,
};

export async function getDashboardStats() {
	// In a real app replace with fetch to your backend API
	return new Promise((res) => setTimeout(() => res(MOCK_STATS), 250));
}

export async function getQuickSummary() {
	return new Promise((res) =>
		setTimeout(
			() =>
				res([
					{ id: 1, title: "Total Recharges", value: MOCK_STATS.totalRecharges },
					{ id: 2, title: "Today", value: MOCK_STATS.todayRecharges },
				]),
			200
		)
	);
}
