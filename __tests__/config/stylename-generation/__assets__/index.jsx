import A from './MockPackageA/TestComponent';

const B = require('./MockPackageB/TestComponent').default;

export default function TestApp() {
  return <><A /><B /></>;
}
