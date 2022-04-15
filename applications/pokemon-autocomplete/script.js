import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  mergeMap,
  switchMap,
  tap,
  of,
  merge,
  from,
  pluck,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResults,
  clearResults,
  endpoint,
  endpointFor,
  search,
} from '../pokemon/utilities';

const search$ = fromEvent(search, 'input').pipe(
  debounceTime(300),
  map((event) => event.target.value),
  // distinctUntilChanged(),
  // NOTE: we could also use/argue for `exhaustMap` instead:
  switchMap((searchTerm) =>
    fromFetch(endpoint + searchTerm + '?delay=5000&chaos=true').pipe(
      mergeMap((response) => response.json()),
    ),
  ),
  tap(clearResults),
  map((response) => response.pokemon),
  tap(addResults),
);

search$.subscribe(console.log);
