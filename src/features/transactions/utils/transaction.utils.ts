import { Transaction, TransactionFilters, TransactionStatus } from '../types/transaction.types';

export function mapStatus(status: boolean): TransactionStatus {
	return status ? 'success' : 'failed';
}

export function formatCurrency(amount: string, currency: string): string {
	const num = parseFloat(amount);
	if (isNaN(num)) return `${currency}0.00`;
	return `${currency}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(isoString: string): string {
	const date = new Date(isoString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

export function formatAmount(amount: number): string {
	return amount.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export function capitalise(str: string): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// Compares ISO date strings at the date level (YYYY-MM-DD) to avoid timezone skew.
export function filterTransactions(
	transactions: Transaction[],
	filters: TransactionFilters
): Transaction[] {
	const { search, statuses, category, dateFrom, dateTo } = filters;
	const query = search.trim().toLowerCase();

	return transactions.filter((tx) => {
		if (query && !tx.name.toLowerCase().includes(query) && !tx.id.toLowerCase().includes(query))
			return false;

		if (statuses.length > 0 && !statuses.includes(mapStatus(tx.status))) return false;

		if (category && tx.category !== category) return false;

		const txDate = tx.createdAt.slice(0, 10);
		if (dateFrom && txDate < dateFrom) return false;
		if (dateTo && txDate > dateTo) return false;

		return true;
	});
}
