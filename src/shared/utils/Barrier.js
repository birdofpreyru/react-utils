import { Barrier } from '@dr.pogodin/js-utils';

export { Barrier };

/**
 * Creates a new Barrier.
 * @deprecated Prefer using `Barrier` class construction directly,
 *  i.e. `new Barrier(executor)` instead of `newBarrier(executor)`.
 * @returns {Barrier}
 */
export function newBarrier(executor) {
  return new Barrier(executor);
}
