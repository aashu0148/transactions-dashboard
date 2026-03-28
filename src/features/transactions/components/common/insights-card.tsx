import { cn } from '@/shared/utils/cn';
import { ReactNode } from 'react';

interface InsightsCardProps {
	label: string;
	value: string | number;
	icon: ReactNode;
	valueClassName?: string;
}

export function InsightsCard({ label, value, icon, valueClassName }: InsightsCardProps) {
	return (
		<div className="flex min-w-0 flex-1 flex-col gap-1 px-5 py-4">
			<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
				<span className="shrink-0 opacity-70">{icon}</span>
				{label}
			</div>
			<span className={cn('truncate text-lg font-semibold tracking-tight', valueClassName)}>
				{value}
			</span>
		</div>
	);
}
