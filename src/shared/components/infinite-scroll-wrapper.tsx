'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';

interface InfiniteScrollWrapperProps {
	className?: string;
	children: ReactNode;
	onNearEnd?: () => void;
	loadBefore?: number;
	currentRecordsLength: number;
}

export const InfiniteScrollWrapper = ({
	className = '',
	children,
	onNearEnd,
	loadBefore = 300,
	currentRecordsLength,
}: InfiniteScrollWrapperProps) => {
	const bufferRef = useRef<HTMLDivElement>(null);

	const nearEndFuncRef = useRef(() => {});

	const handleNearEndReached = useCallback(() => {
		nearEndFuncRef?.current();
	}, []);

	const handleObserverCallback = useCallback(
		(entries: IntersectionObserverEntry[]) => {
		const target = entries[0];

		if (target.isIntersecting) handleNearEndReached();
		},
		[handleNearEndReached]
	);

	const findScrollParent = useCallback((element: HTMLElement | null): HTMLElement | null => {
		if (!element) return null;

		const style = window.getComputedStyle(element);
		const overflowY = style.getPropertyValue('overflow-y');

		if (overflowY === 'auto' || overflowY === 'scroll' || element === document.documentElement) {
			return element;
		}

		return findScrollParent(element.parentElement); // eslint-disable-line
	}, []);

	const handleContainerScroll = useCallback((event: Event) => {
		// For window scroll events the target is the window object, not an element.
		// In that case fall back to document.documentElement for scroll metrics.
		const target = event.target as HTMLElement | Window;
		const scrollEl =
			target instanceof Window ? document.documentElement : (target as HTMLElement);
		if (!scrollEl) return;

		const scrollPosition = scrollEl.scrollTop;
		const containerHeight = scrollEl.clientHeight;
		const scrollHeight = scrollEl.scrollHeight;

		const diff = Math.abs(scrollHeight - scrollPosition - containerHeight);
		const endReached = diff < 4;

		if (endReached) handleNearEndReached();
	}, []);

	useEffect(() => {
		nearEndFuncRef.current = typeof onNearEnd === 'function' ? onNearEnd : () => {};
	}, [onNearEnd]);

	useEffect(() => {
		let scrollContainer = findScrollParent(bufferRef.current);
		if (scrollContainer?.tagName === 'HTML') scrollContainer = document.body;

		// When the scroll container is document.body, its bounding rect equals the
		// full page height (not the visible viewport). Passing it as the IntersectionObserver
		// root causes the buffer to always be "intersecting". Use null instead so the
		// observer uses the actual browser viewport as its root.
		const isBodyScroll = scrollContainer === document.body;
		const options = {
			root: isBodyScroll ? null : scrollContainer,
			rootMargin: `0px 0px ${loadBefore}px 0px`,
			threshold: 0.1,
		};
		const observer = new IntersectionObserver(handleObserverCallback, options);
		const buffer = bufferRef.current;

		if (buffer) observer.observe(buffer);

		// For body-level scrolling, scroll events fire on window and scroll position
		// lives on document.documentElement, not document.body.
		const scrollEventTarget: EventTarget | null = isBodyScroll ? window : scrollContainer;

		if (currentRecordsLength > 0 && scrollContainer) {
			const syntheticTarget = isBodyScroll ? document.documentElement : scrollContainer;
			handleContainerScroll({ target: syntheticTarget } as unknown as Event);
		}

		if (scrollEventTarget) scrollEventTarget.addEventListener('scroll', handleContainerScroll);

		return () => {
			scrollEventTarget?.removeEventListener('scroll', handleContainerScroll);
			if (buffer) observer.unobserve(buffer);
		};
	}, [currentRecordsLength]);

	return (
		<div
			className={`relative ${className} pb-2`}
			data-infinite-scroll-wrapper
		>
			{children}

			<div
				ref={bufferRef}
				className="pointer-events-none p-0 opacity-0"
			/>
		</div>
	);
};
