import { fromEvent, interval, merge, NEVER } from 'rxjs';
// NOTE: to reduce bundle size, it's better to import operators from 'rxjs/operators' instead:
import { skipUntil, takeUntil, scan } from 'rxjs/operators';
import { setCount, startButton, pauseButton } from './utilities';

const start$ = fromEvent(startButton, 'click');
const pause$ = fromEvent(pauseButton, 'click');

// ===========================Intermediate V1===============================
const counter$ = interval(1000).pipe(
  skipUntil(start$),
  // NOTE: we need to use `scan` here so we can manage our own state. Without this, by the time user clicks on
  // start button, the interval has already started and hence user does NOT start from number 0. Using `scan`,
  // we make sure the starting state is always 0, no matter how late the user start (by clicking the start buttob):
  scan((total) => total + 1, 0),
  takeUntil(pause$),
);

counter$.subscribe(setCount);
// ===========================Basic V1===============================
// let interval$;

// start$.subscribe(() => {
//   interval$ = interval(1000).subscribe(setCount);
// });

// pause$.subscribe(() => {
//   interval$.unsubscribe();
// });

// ===========================Basic V2===============================
// We can also store the subscription:

// let interval$ = interval(1000);
// let subscription;

// start$.subscribe(() => {
//   subscription = interval$.subscribe(setCount);
// });

// pause$.subscribe(() => {
//   subscription.unsubscribe();
// });
