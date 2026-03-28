export type TransactionStatus = 'success' | 'failed' | 'pending';

export interface Transaction {
	id: string;
	createdAt: string;
	name: string;
	avatar: string;
	amount: string;
	currency: string;
	category: string;
	status: boolean;
}

export interface TransactionFilters {
	search: string;
	statuses: TransactionStatus[];
	category: string;
	dateFrom: string | null;
	dateTo: string | null;
}

export interface TransactionInsights {
	totalCount: number;
	totalSuccessAmount: number;
	successRate: number;
	topCategory: string;
}
