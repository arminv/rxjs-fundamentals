import { fromEvent, interval, merge, NEVER } from 'rxjs';
// NOTE: to reduce bundle size, it's better to import operators from 'rxjs/operators' instead:
import { skipUntil, takeUntil, scan, mapTo, switchMap } from 'rxjs/operators';
import { setCount, startButton, pauseButton } from './utilities';

// ===========================Advanced=========================
const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));

const counter$ = merge($start, $pause).pipe(
  switchMap((shouldIBeRunning) => {
    if (shouldIBeRunning) {
      // NOTE: problem with this is that we get a new interval each time, so we CANNOT resume our counting, but only reset back to start (every time)!
      return interval(1000);
    } else {
      return NEVER;
    }
  }),
  // NOTE: this `scan` now allows us to keep the same interval (when user pauses), and just resume it when user starts again:
  scan((total) => total + 1, 0),
);

// ===========================Intermediate V1=========================
// const start$ = fromEvent(startButton, 'click');
// const pause$ = fromEvent(pauseButton, 'click');

// const counter$ = interval(1000).pipe(
//   skipUntil(start$),
//   // NOTE: we need to use `scan` here so we can manage our own state. Without this, by the time user clicks on
//   // start button, the interval has already started and hence user does NOT start from number 0. Using `scan`,
//   // we make sure the starting state is always 0, no matter how late the user start (by clicking the start buttob):
//   scan((total) => total + 1, 0),
//   takeUntil(pause$),
// );

// counter$.subscribe(setCount);
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
