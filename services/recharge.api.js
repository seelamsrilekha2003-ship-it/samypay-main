const MOCK_RECHARGES = [
	{ id: 1, ref: "RCH1001", account: "9876543210", provider: "Provider A", amount: 199, status: "Success" },
	{ id: 2, ref: "RCH1002", account: "9876501234", provider: "Provider B", amount: 99, status: "Pending" },
];

export async function getRecharges(params = {}) {
	// params can include pagination or filters
	return new Promise((res) => setTimeout(() => res(MOCK_RECHARGES), 200));
}

export async function createRecharge(payload) {
	// In a real integration you would POST to backend
	const newItem = { id: Date.now(), ref: `RCH${Date.now()}`, ...payload, status: "Success" };
	return new Promise((res) => setTimeout(() => res(newItem), 250));
}
