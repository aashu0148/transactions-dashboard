import { cn } from '@/shared/utils/cn';
import { TransactionStatus } from '../../types/transaction.types';
import { capitalise } from '../../utils/transaction.utils';

interface StatusBadgeProps {
	status: TransactionStatus;
}

const statusStyles: Record<TransactionStatus, string> = {
	success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
	failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
	pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export function StatusBadge({ status }: StatusBadgeProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
				statusStyles[status]
			)}
		>
			{capitalise(status)}
		</span>
	);
}
