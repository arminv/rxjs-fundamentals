import { fromEvent, interval, merge, NEVER } from 'rxjs';
import { setCount, startButton, pauseButton } from './utilities';

const start$ = fromEvent(startButton, 'click');
const pause$ = fromEvent(pauseButton, 'click');

let interval$;

start$.subscribe(() => {
  interval$ = interval(1000).subscribe(setCount);
});

pause$.subscribe(() => {
  interval$.unsubscribe();
});

// We can also store the subscription:

let interval$ = interval(1000);
let subscription;

start$.subscribe(() => {
  subscription = interval$.subscribe(setCount);
});

pause$.subscribe(() => {
  subscription.unsubscribe();
});
