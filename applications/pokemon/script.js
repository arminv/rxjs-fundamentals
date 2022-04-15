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
  filter,
  catchError,
  concat,
  take,
  EMPTY,
  pluck,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResults,
  addResult,
  clearResults,
  endpointFor,
  search,
  form,
} from '../pokemon/utilities';

const endpoint = 'http://localhost:3333/api/pokemon/search';

const search$ = fromEvent(search, 'input').pipe(
  debounceTime(300),
  map((event) => event.target.value),
  distinctUntilChanged(),
  switchMap((searchTerm) => {
    return fromFetch(endpoint + searchTerm + '?delay=1000&chaos=true').pipe(
      mergeMap((response) => response.json()),
      tap(clearResults),
      // NOTE: `pluck` removes a given property (by its name):
      pluck('pokemon'),
      tap(addResults),
    );
  }),
);

search$.subscribe();
