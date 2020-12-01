type ConfigTarget = HTMLElement | NodeList | string;

interface Style {
	[key: string]: string
};

interface Transition {
	start: Style,
	end: Style,
	stagger: number,
	delay: 0,
	observerOptions: {}
	[key: string]: {}
};

const EaseOutQuad = 'cubic-bezier(0.25, 1, 0.5, 1)';
const DefaultObserverOptions = {threshold: .6};

const Keyfames = `
	@keyframes SoSWipeUp {
		0% {
			clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
		}
		100% {
			clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
		}
	}
	@keyframes SoSWipeDown {
		0% {
			clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
		}
		100% {
			clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
		}
	}
`;

let styleInjected = false;

export const emptyTransition: Transition = {
	start: {},
	end: {},
	stagger: 0,
	delay: 0,
	observerOptions: {...DefaultObserverOptions}
}

export const fadeSlideUp: Transition = {
	start: {
		'opacity': '0',
		'transform': 'translate(0, 100px)'
	},
	end: {
		'opacity': '1',
		'transform': 'translate(0, 0)',
		'transition': `opacity 1.5s ${EaseOutQuad}, transform 1.5s ${EaseOutQuad}`
	},
	stagger: 130,
	delay: 0,
	observerOptions: {...DefaultObserverOptions}
};

export const fadeSlideDown: Transition = {
	start: {
		'opacity': '0',
		'transform': 'translate(0, -100px)'
	},
	end: {
		'opacity': '1',
		'transform': 'translate(0, 0)',
		'transition': `opacity 1.5s ${EaseOutQuad}, transform 1.5s ${EaseOutQuad}`
	},
	stagger: 130,
	delay: 0,
	observerOptions: {...DefaultObserverOptions}
};

export const wipeUp: Transition = {
	start: {
		'opacity': '0'
	},
	end: {
		'animation': `SoSWipeUp 1.5s ${EaseOutQuad}`,
		'opacity': '1',
	},
	stagger: 200,
	delay: 0,
	observerOptions: {...DefaultObserverOptions}
};

export const wipeDown: Transition = {
	start: {
		'opacity': '0'
	},
	end: {
		'animation': `SoSWipeDown 1.5s ${EaseOutQuad}`,
		'opacity': '1',
	},
	stagger: 200,
	delay: 0,
	observerOptions: {...DefaultObserverOptions}
};

export const makeTransition = (obj: object): Transition => {
	return {...emptyTransition, ...obj};
};

const injectStyle = () => {
	document.head.innerHTML += `<style id="show-on-scroll-style">${Keyfames}</style>`;
	styleInjected = true;
};

const isValidTarget = (target:any): target is ConfigTarget => {
	return target instanceof HTMLElement
		|| target instanceof NodeList
		|| typeof target === 'string';
};

const styleElement = (element: HTMLElement, style: Style) => {
	for (const property in style) {
		element.style.setProperty(property, style[property]);
	}
};

const showOnScroll = (
	target: ConfigTarget,
	transition: Transition = {...fadeSlideUp},
	callback?: Function
) => {
	let targets: HTMLElement[] = [];

	if (!isValidTarget(target)) {
		throw new Error('Invalid target for scrolling to')
	}

	if (!styleInjected) injectStyle();
	
	if (target instanceof HTMLElement) {
		targets.push(target);
	}

	if (target instanceof NodeList) {
		target.forEach(element => targets.push(element as HTMLElement));
	}

	if (typeof target === 'string') {
		document.querySelectorAll(target)?.forEach(element => targets.push(element as HTMLElement));
	}

	// apply transition start styles
	targets.forEach(target => styleElement(target, transition.start));

	const observerCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
		const entriesToShow = entries.filter(entry => entry.isIntersecting);
		
		entriesToShow.forEach((entry: IntersectionObserverEntry, index) => {
			const target = entry.target as HTMLElement;
			observer.unobserve(target);

			const transitionDelay = (transition.stagger * index) + transition.delay;

			// apply transition end styles
			styleElement(target, {
				...transition.end,
				'transition-delay': `${transitionDelay}ms`,
				'animation-delay': `${transitionDelay}ms`
			});

			if (typeof callback === 'function') callback(target);
		});
	};

	const observer = new IntersectionObserver(observerCallback, transition.observerOptions);

	targets.forEach(target => observer.observe(target));

	return {
		destroy: () => {
			targets.forEach(target => {
				target.style.cssText = '';
			});
			observer.disconnect();
		}
	};
}

export default showOnScroll;