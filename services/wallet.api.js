const MOCK_WALLETS = [
	{ account: "main", opening: 1000000, closing: 997000, status: "OK" },
];

export async function getWalletBalances() {
	return new Promise((res) => setTimeout(() => res(MOCK_WALLETS), 200));
}

export async function requestWalletTopup(payload) {
	const req = { id: Date.now(), ...payload, status: "Pending" };
	return new Promise((res) => setTimeout(() => res(req), 250));
}

export async function approveRequest(id) {
	return new Promise((res) => setTimeout(() => res({ id, status: "Approved" }), 200));
}

