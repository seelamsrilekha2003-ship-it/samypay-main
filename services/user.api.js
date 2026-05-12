const MOCK_USERS = [
	{ id: 1, name: "Alice", mobile: "9000000001", balance: 1200, type: "Retailer" },
	{ id: 2, name: "Bob", mobile: "9000000002", balance: 5400, type: "Distributor" },
];

export async function getUsers(filter = {}) {
	return new Promise((res) => setTimeout(() => res(MOCK_USERS), 200));
}

export async function getUserById(id) {
	return new Promise((res) => setTimeout(() => res(MOCK_USERS.find((u) => u.id === id) || null), 200));
}

export async function createUser(payload) {
	const newUser = { id: Date.now(), ...payload };
	return new Promise((res) => setTimeout(() => res(newUser), 250));
}
