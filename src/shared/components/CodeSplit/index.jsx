// This module exposes client- or server-side version of the <CodeSplit>
// component, depending on the environment. That component is used internally
// to implement the code splitting. Library users should use splitComponent()
// function to use the code splitting (see "utils/splitComponent.js").

import { requireWeak } from 'utils/webpack';
import ClientSide from './ClientSide';

export default requireWeak('./ServerSide', __dirname) || ClientSide;
