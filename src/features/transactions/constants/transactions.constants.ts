import { TransactionFilters, TransactionStatus } from '../types/transaction.types';

export const PAGE_SIZE = 10;

export const TRANSACTIONS_QUERY_KEY = 'transactions';

export const STATUS_OPTIONS: { label: string; value: TransactionStatus }[] = [
	{ label: 'Success', value: 'success' },
	{ label: 'Failed', value: 'failed' },
];

export const CATEGORY_OPTIONS: { label: string; value: string }[] = [
	{ label: 'All', value: '' },
	{ label: 'Withdrawal', value: 'withdrawal' },
	{ label: 'Deposit', value: 'deposit' },
	{ label: 'Transfer', value: 'transfer' },
	{ label: 'Payment', value: 'payment' },
];

export const DEFAULT_FILTERS: TransactionFilters = {
	search: '',
	statuses: [],
	category: '',
	dateFrom: null,
	dateTo: null,
};
