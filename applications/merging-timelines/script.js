import { fromEvent, merge, interval, concat, race, forkJoin } from 'rxjs';
import { mapTo, startWith, take, map } from 'rxjs/operators';
import {
  labelWith,
  startButton,
  pauseButton,
  setStatus,
  bootstrap,
} from './utilities';

const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));

// NOTE: `merge` creates a single observable stream from multiple streams:
const isRunning$ = merge(start$, pause$).pipe(startWith(false));

isRunning$.subscribe(setStatus);

// ==================================================================
const first$ = interval(1500).pipe(map(labelWith('First')), take(4));
const second$ = interval(1000).pipe(map(labelWith('Second')), take(4));
// NOTE: `merge` behaves in a first come first served basis, whereas with `concat` we can coordinate
// these timings and have more flexibility (e.g. finish the first stream, only then start taking from the second stream):
const combinedMerge$ = merge(first$, second$);
const combinedConcat$ = concat(first$, second$);

// NOTE: `race` works similar to how it does in promises, which ever stream emits first, take that.
// One example use case is when we want to show a loading indicator only if the data has not come in after a certain amount of time.
// In this case, data will be one stream, loading will be another stream, and we combine them using `race`.
const combinedRace$ = race(first$, second$);

// NOTE: `forkJoin` (deprecated, but commonly used before) does not emit anything until all child streams are done.
// Then, it will emit an array with the final values from each stream as the values in the array:
const combinedForkJoin$ = forkJoin(first$, second$);

bootstrap({ first$, second$, combinedConcat$ });
