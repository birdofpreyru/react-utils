import { getMockUuid } from 'utils/jest';

export function v4() {
  v4.state += 1;
  return getMockUuid(v4.state);
}

v4.state = 0;

export default null;
