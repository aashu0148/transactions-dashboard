'use client';

import React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '../utils/cn';
import { ScrollArea } from './ui/scroll-area';

export interface DropdownOption {
	label: string;
	sublabel?: string;
	value: string;
	onClick?: (e: React.MouseEvent) => void;
	disabled?: boolean;
	icon?: React.ReactNode;
	danger?: boolean;
	tooltip?: string;
	showSeparator?: boolean;
	subOptions?: DropdownOption[];
	className?: string;
}

interface Props extends React.PropsWithChildren {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	options: DropdownOption[];
	maxHeight?: number;
	className?: string;
	contentStyle?: React.CSSProperties;
	modal?: boolean;
	truncateLongOptions?: boolean;
	dropdownSide?: 'top' | 'bottom' | 'left' | 'right';
	dropdownAlign?: 'center' | 'end' | 'start';
}

function DropdownOptionItem({
	option,
	truncateLongOptions,
}: {
	option: DropdownOption;
	truncateLongOptions: boolean;
}) {
	// If option has subOptions, render a submenu (recursive)
	if (option.subOptions && option.subOptions.length > 0) {
		return (
			<>
				<DropdownMenuSub>
					<DropdownMenuSubTrigger
						className={cn(
							'cursor-pointer text-sm',
							option.danger && 'text-destructive',
							option.sublabel && 'flex flex-col items-start gap-1'
						)}
						disabled={option.disabled}
					>
						<div className="flex items-center gap-2">
							{option.icon ? <span className="flex-shrink-0">{option.icon}</span> : null}
							<p className={cn('flex-shrink', truncateLongOptions ? 'truncate' : '')}>
								{option.label}
							</p>
						</div>
						{option.sublabel && (
							<span
								className={cn(
									'line-clamp-1 text-xs font-normal text-secondary',
									truncateLongOptions && 'max-w-full truncate'
								)}
							>
								{option.sublabel}
							</span>
						)}
					</DropdownMenuSubTrigger>

					<DropdownMenuSubContent className="min-w-[120px]">
						{option.subOptions.map((subOption) => (
							<DropdownOptionItem
								key={subOption.value}
								option={subOption}
								truncateLongOptions={truncateLongOptions}
							/>
						))}
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				{option.showSeparator && <DropdownMenuSeparator />}
			</>
		);
	}

	// Regular option without submenu
	const menuItem = (
		<>
			<DropdownMenuItem
				className={cn(
					'text-sm',
					option.danger && 'text-destructive',
					option.sublabel && 'flex flex-col items-start gap-1',
					option.className
				)}
				onClick={(e) => option.onClick?.(e)}
				disabled={option.disabled}
			>
				<div className="flex items-center gap-2">
					{option.icon ? <span className="flex-shrink-0">{option.icon}</span> : null}
					<p className={cn('flex-shrink', truncateLongOptions ? 'truncate' : '')}>{option.label}</p>
				</div>
				{option.sublabel && (
					<span
						className={cn(
							'line-clamp-1 text-xs font-normal text-secondary',
							truncateLongOptions && 'max-w-full truncate'
						)}
					>
						{option.sublabel}
					</span>
				)}
			</DropdownMenuItem>
			{option.showSeparator && <DropdownMenuSeparator />}
		</>
	);

	// Only wrap with Tooltip if tooltip content exists
	if (option.tooltip) {
		return (

			<div key={option.value}>{menuItem}</div>

		);
	}

	return menuItem;
}

function SimpleDropdown({
	options,
	maxHeight = 400,
	open,
	onOpenChange,
	children,
	className,
	contentStyle,
	modal,
	dropdownSide,
	truncateLongOptions = false,
	dropdownAlign,
}: Props) {
	return (
		<DropdownMenu
			modal={modal}
			open={open}
			onOpenChange={onOpenChange}
		>
			<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

			<DropdownMenuPortal container={document.getElementById('popovers')}>
				<DropdownMenuContent
					className={cn('min-w-[120px] p-0', className)}
					style={contentStyle}
					side={dropdownSide}
					align={dropdownAlign}
					onClick={(e) => e.stopPropagation()}
				>
					<ScrollArea
						viewportClassName={cn(truncateLongOptions && '[&>div]:max-w-[100%] [&>div]:!block')}
						viewportStyle={{ maxHeight: `${maxHeight}px` }}
						className="p-1"
					>
						{options.map((option) => (
							<DropdownOptionItem
								key={option.value}
								option={option}
								truncateLongOptions={truncateLongOptions}
							/>
						))}
					</ScrollArea>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
}

export default SimpleDropdown;
