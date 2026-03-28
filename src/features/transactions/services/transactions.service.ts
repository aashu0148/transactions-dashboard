import { PAGE_SIZE } from '../constants/transactions.constants';
import { Transaction } from '../types/transaction.types';

const BASE_URL = 'https://696e0139d7bacd2dd7155c6a.mockapi.io/barter-tech/transactions';

export async function fetchTransactionsPage(page: number): Promise<Transaction[]> {
	const params = new URLSearchParams({
		page: String(page),
		limit: String(PAGE_SIZE),
	});

	const response = await fetch(`${BASE_URL}?${params}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
	}

	return response.json() as Promise<Transaction[]>;
}
