import logo from './logo.png';

// TODO: I guess, ESLint does not correctly find additional typing
// for *.png modules.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const App: React.FunctionComponent = () => <img alt="logo" src={logo} />;

export default App;
