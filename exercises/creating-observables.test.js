import { from, Observable, of } from 'rxjs';

describe('Exercise: Creating Observables', () => {
  describe(of, () => {
    /**
     * Your mission: Create an observable using `of`, subscribe to it, putting
     * the values into the `results` array, and get the expectation below to
     * pass.
     */
    it('should create an observable out of a single value', () => {
      const result = [];

      const observable$ = of(1);
      observable$.subscribe((value) => result.push(value));

      expect(result).toEqual([1]);
    });

    it('should take a series of objects as arguments and create an observable', () => {
      const result = [];

      const observable$ = of(
        { type: 'INCREMENT', payload: 1 },
        { type: 'RESET' },
        { type: 'INCREMENT', payload: 2 },
        { type: 'DECREMENT', payload: 1 },
      );
      observable$.subscribe((value) => result.push(value));

      expect(result).toEqual([
        { type: 'INCREMENT', payload: 1 },
        { type: 'RESET' },
        { type: 'INCREMENT', payload: 2 },
        { type: 'DECREMENT', payload: 1 },
      ]);
    });
  });

  describe(from, () => {
    it('should take an array of objects as arguments and create an observable', () => {
      const result = [];

      const observable$ = from([
        { type: 'INCREMENT', payload: 1 },
        { type: 'RESET' },
        { type: 'INCREMENT', payload: 2 },
        { type: 'DECREMENT', payload: 1 },
      ]);
      observable$.subscribe((value) => result.push(value));

      expect(result).toEqual([
        { type: 'INCREMENT', payload: 1 },
        { type: 'RESET' },
        { type: 'INCREMENT', payload: 2 },
        { type: 'DECREMENT', payload: 1 },
      ]);
    });

    it('should create an observable from a generator', () => {
      // NOTE: this generator will not actually return 4 at the end, it finishes at `return`:
      function* values() {
        yield 1;
        yield 2;
        yield 3;
        return 4;
      }

      const result = [];

      // NOTE: remember to actually call the generator (`values()` here) when passing it as an ergument ot `from`:
      const observable$ = from(values());
      observable$.subscribe((value) => result.push(value));

      expect(result).toEqual([1, 2, 3]);
    });

    /**
     * So far, all of our observables have executed synchronously. We can
     * create observables from promises, but those will obviously be
     * asynchronous in nature. Observables are naturals at this, but Jest
     * (or whatever testing framework you prefer) need a little help.
     *
     * This is a good opportunity for us to learn how to handle the
     * completion of an observable differently than the values that are
     * emitted from it.
     *
     * Your mission: collect the values as their emitted, but then
     * only assert your expectation once the observable has completed.
     */
    it('should create an observable from a promise', (done) => {
      const promise = Promise.resolve(1);
      const result = [];

      const observable$ = from(promise);
      // NOTE: because we are dealing with async stuff, we need to run our test only when the promise has resolved
      // hence the use of `complete`:
      observable$.subscribe({
        next: (value) => result.push(value),
        complete: () => {
          expect(result).toEqual([1]);
          done();
        },
      });
    });

    /**
     * We'll get into catching errors in greater detail, but this is a good
     * opportunity to see how to respond to an error—in this case, a rejected
     * promise—in our observables.
     */
    it('should create an observable from a promise that rejects', (done) => {
      const promise = Promise.reject({ error: 'Something terrible happened' });

      const observable$ = from(promise);
      observable$.subscribe({
        error: (error) => {
          expect(error).toEqual({ error: 'Something terrible happened' });
          done();
        },
      });
    });

    it('should deal with a bespoke observable (BONUS)', () => {
      const result = [];

      // NOTE: creating a new/bespoke observable:
      const observable$ = new Observable((subscriber) => {
        subscriber.next('John');
        subscriber.next('Paul');
        subscriber.next('George');
        subscriber.next('Ringo');
        // NOTE: we have control over when this observable finishes/completes
        // nothing after the next line executes because of `complete` call,
        // similar to a return statement in a function!
        subscriber.complete();
        // NOTE: this line never gets executed:
        subscriber.next('Armin');
      });

      observable$.subscribe((value) => result.push(value));

      expect(result).toEqual(['John', 'Paul', 'George', 'Ringo']);
    });
  });
});
