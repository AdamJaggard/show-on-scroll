# Show On Scroll (SoS)

SoS is a javascript library that allows you to transition elements into view when you scroll to them. Currently in a beta stage and being tested.

## Features

- Simple one-way transitions (they don't reverse or reset)
- Transitions are powered by CSS and run buttery smooth
- Multiple element staggering by default (configurable)
- Built in transitions
- Define your own transitions and SoS will handle triggering them
- Based on the IntersectionObserver API
- Written in TypeScript

## Examples

`npm install @zerofool/show-on-scroll`


### Simple
```javascript
import showOnScroll from '@zerofool/show-on-scroll';

showOnScroll('.boxes');
```
We didn't specify a type of transition because `fadeSlideUp` is the default if one isn't supplied.


### Or using a different built-in transition
```javascript
import showOnScroll, { wipeUp } from '@zerofool/show-on-scroll';

showOnScroll('.boxes', wipeUp);
```

### Modifying a built-in transition
```javascript
import showOnScroll, { fadeSlideUp } from '@zerofool/show-on-scroll';

// copy an existing transition, disable staggering
const modifiedTransiton = {
	...fadeSlideUp,
	stagger: 0
};

showOnScroll('.boxes', modifiedTransiton);
```

### Define your own transition
```javascript
import showOnScroll, { makeTransition } from '@zerofool/show-on-scroll';

const customTransition = makeTransition({
	start: {'opacity': '0'},
	end: {
		'opacity': '1'
		'transition': 'opacity 1s'
	}
});

showOnScroll('.boxes', customTransition);
```
At it's most basic a transition is an object with a start and and end state. Each state is an object where the keys are valid css properties (kebab-case) and the values are the css property values. Remember to include a transition property for the end state if you're defining your own transitions or states will switch without any animation.

## Staggering

SoS will automatically stagger transitioned elements as they come into view regardless of where they sit in the markup. It works responsively too.

## Style attributes

SoS adds css to the transitioned elements style attribute directly; it assumes it has your permission to do this...

## Documentation

Coming soon™