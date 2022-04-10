import { fromEvent, interval } from 'rxjs';
import {
  throttleTime,
  debounceTime,
  delay,
  debounce,
  throttle,
  scan,
  map,
  tap,
} from 'rxjs/operators';

import {
  button,
  panicButton,
  addMessageToDOM,
  deepThoughtInput,
  setTextArea,
  setStatus,
} from './utilities';

const panicClicks$ = fromEvent(panicButton, 'click');
const buttonClicks$ = fromEvent(button, 'click').pipe(
  // delay(2000),
  // throttleTime(2000),
  // debounceTime(2000),
  // NOTE: `throttle` and `debounce` work on other observables (like `takeUntil` and `skipUntil`):
  // debounce(() => panicClicks$),
  throttle(() => panicClicks$),
);

panicClicks$.subscribe();
buttonClicks$.subscribe(addMessageToDOM);
