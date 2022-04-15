import { fromEvent, of, timer, merge, NEVER } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  exhaustMap,
  mapTo,
  mergeMap,
  retry,
  startWith,
  switchMap,
  tap,
  pluck,
} from 'rxjs/operators';

import {
  fetchButton,
  stopButton,
  clearError,
  clearFacts,
  addFacts,
  setError,
} from './utilities';

// NOTE: the server allows us to simulate real conditions by passing a delay and/or chaos and/or flakiness as query params:
const endpoint =
  'http://localhost:3333/api/facts?delay=2000&chaos=true&flakiness=0';

const fetchData = () => {
  // NOTE: a rule of thumb - if you were going to use `.then()` (i.e. if we were not using RxJS),
  // then you probably need a`mergeMap` (and not a `map`):
  return fromFetch(endpoint).pipe(
    // NOTE: we are using `tap` here to clear any previous errors:
    tap(clearError),
    mergeMap((response) => {
      if (response.ok) {
        return response.json();
      } else {
        // NOTE: because we are still inside a `mergeMap`, we need to return and observable here too:
        // return of({ error: 'Something went wrong.' });
        // NOTE: alternatively, we could actually throw an error, which we will have to catch later (using `catchError` operator):
        throw new Error('Something went wrong.');
      }
    }),
    // NOTE: we want to try 4 times if there is failure:
    retry(4),
    // NOTE: we are catching the error on the inner observable (not the outside one - we could do that too!):
    catchError((error) => {
      console.warn(error);
      return of({ error: error.message });
    }),
  );
};

// const fetch$ = fromEvent(fetchButton, 'click').pipe(
//   // NOTE: we want to ignore any user clicks while we are still fetching from API hence use of `exhaustMap` (we resume clicks as soon as the request is done):
//   exhaustMap(fetchData),
// );

const fetch$ = fromEvent(fetchButton, 'click').pipe(mapTo(true));
const stop$ = fromEvent(stopButton, 'click').pipe(mapTo(false));

const factStream$ = merge(fetch$, stop$).pipe(
  switchMap((shouldFetch) => {
    if (shouldFetch) {
      // NOTE: this `timer` starts now (0), and then emits in 5000ms (`interval` on the other hand, first waits, then emits):
      return timer(0, 5000).pipe(
        tap(() => clearError()),
        tap(() => clearFacts()),
        exhaustMap(fetchData),
      );
    } else {
      return NEVER;
    }
  }),
);

factStream$.subscribe(addFacts);

// ========================
// fetch$.subscribe(({ facts, error }) => {
//   if (error) {
//     return setError(error);
//   }

//   clearFacts();
//   addFacts({ facts });
// });
