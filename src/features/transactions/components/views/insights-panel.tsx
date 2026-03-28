import { BarChart3, CheckCircle2, DollarSign, Hash } from 'lucide-react';
import { TransactionInsights } from '../../types/transaction.types';
import { capitalise, formatAmount } from '../../utils/transaction.utils';
import { InsightsCard } from '../common/insights-card';

interface InsightsPanelProps {
	insights: TransactionInsights;
	isLoading: boolean;
}

export function InsightsPanel({ insights, isLoading }: InsightsPanelProps) {
	const dash = '—';

	return (
		<div className="grid grid-cols-2 overflow-hidden rounded-xl border border-border bg-card sm:grid-cols-4">
			<div className="border-b border-r border-border sm:border-b-0">
				<InsightsCard
					label="Total loaded"
					value={isLoading ? dash : insights.totalCount.toLocaleString()}
					icon={<Hash className="size-3.5" />}
				/>
			</div>
			<div className="border-b border-border sm:border-b-0 sm:border-r">
				<InsightsCard
					label="Success amount"
					value={isLoading ? dash : `$${formatAmount(insights.totalSuccessAmount)}`}
					icon={<DollarSign className="size-3.5" />}
					valueClassName="text-emerald-600"
				/>
			</div>
			<div className="border-r border-border">
				<InsightsCard
					label="Success rate"
					value={isLoading ? dash : `${insights.successRate.toFixed(1)}%`}
					icon={<CheckCircle2 className="size-3.5" />}
					valueClassName={insights.successRate >= 50 ? 'text-emerald-600' : 'text-red-500'}
				/>
			</div>
			<div>
				<InsightsCard
					label="Top category"
					value={isLoading ? dash : capitalise(insights.topCategory)}
					icon={<BarChart3 className="size-3.5" />}
				/>
			</div>
		</div>
	);
}
