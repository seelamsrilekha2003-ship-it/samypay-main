const MOCK_REPORTS = {
	recharge: [],
	wallet: [],
};

export async function getRechargeReport(filter = {}) {
	return new Promise((res) => setTimeout(() => res(MOCK_REPORTS.recharge), 200));
}

export async function getWalletReport(filter = {}) {
	return new Promise((res) => setTimeout(() => res(MOCK_REPORTS.wallet), 200));
}

export async function exportReport(type = "recharge", filter = {}) {
	// In real app return generated file url or blob
	return new Promise((res) => setTimeout(() => res({ url: `/exports/${type}.csv` }), 300));
}
