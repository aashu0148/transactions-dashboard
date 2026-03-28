import { useMemo } from 'react';
import { Transaction, TransactionInsights } from '../types/transaction.types';

export function useTransactionInsights(transactions: Transaction[]): TransactionInsights {
	return useMemo(() => {
		const totalCount = transactions.length;

		if (totalCount === 0) {
			return { totalCount: 0, totalSuccessAmount: 0, successRate: 0, topCategory: '—' };
		}

		let successCount = 0;
		let totalSuccessAmount = 0;
		const categoryAmounts: Record<string, number> = {};

		for (const tx of transactions) {
			const amount = parseFloat(tx.amount) || 0;

			if (tx.status) {
				successCount++;
				totalSuccessAmount += amount;
			}

			categoryAmounts[tx.category] = (categoryAmounts[tx.category] ?? 0) + amount;
		}

		const topCategory =
			Object.entries(categoryAmounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—';

		return {
			totalCount,
			totalSuccessAmount,
			successRate: (successCount / totalCount) * 100,
			topCategory,
		};
	}, [transactions]);
}
