import { getMockUuid } from 'utils/jest';

export default function generate() {
  generate.state += 1;
  return getMockUuid(generate.state);
}

generate.state = 0;
