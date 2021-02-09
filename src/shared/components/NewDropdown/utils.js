/**
 * Auxiliary functions for <Dropdown> component.
 */

import { findIndex, findLastIndex } from 'lodash';

/**
 * Returns option name and value as two elements of array.
 * @param {object|string} option
 * @return {string[]}
 */
export function optionNameValue(option) {
  return typeof option === 'string'
    ? [option, option] : [option.name, option.value];
}

/**
 * Returns option value.
 * @param {object|string} option Option object or string.
 * @return {string}
 */
export function optionValue(option) {
  return typeof option === 'string' ? option : option.value;
}

/**
 * Finds the option by value.
 * @param {string} value Option value.
 * @param {array} options Options array.
 * @param {function} [filter] Optional. Filter function.
 * @return {number} Index of the matching option, or -1.
 */
function findOptionIndex(value, options, filter) {
  return options.findIndex(
    (item) => optionValue(item) === value && (!filter || filter(item)),
  );
}

/**
 * Finds the next option index.
 * @param {string} value Current value.
 * @param {array} options Option array.
 * @param {function} [filter] Optional. Filter function.
 * @return {number} Next option index, or -1.
 */
export function findNextOptionIndex(value, options, filter) {
  let index = findOptionIndex(value, options, filter);
  if (index >= 0 && ++index < options.length) {
    return filter ? findIndex(options, filter, index) : index;
  }
  return -1;
}

/**
 * Finds the previous option index.
 * @param {string} value Current value.
 * @param {array} options Option array.
 * @param {function} [filter] Optional. Filter function.
 * @return {number} Previous option index, or -1.
 */
export function findPrevOptionIndex(value, options, filter) {
  let index = findOptionIndex(value, options, filter) - 1;
  if (index >= 0 && filter) index = findLastIndex(options, filter, index);
  return index >= 0 ? index : -1;
}
