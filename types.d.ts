// TODO: Double-check that let does not work?
/* eslint-disable no-var */
declare var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
declare var REACT_UTILS_WEBPACK_BUNDLE: boolean | undefined;
declare var REACT_UTILS_LIBRARY_LOADED: boolean | undefined;
declare var REACT_UTILS_FORCE_CLIENT_SIDE: boolean | undefined;
/* eslint-enable no-var */

declare module '@babel/register/experimental-worker' {
  const register: {
    (args: {
      envName: string;
      extensions: string[];
      root: string;
    }): void;
    revert: () => void;
  };

  export default register;
}

declare module '*.png' {
  const path: string;
  export default path;
}

declare namespace React {
  // This allows all JSX elements to have additional "styleName" attribute,
  // handled by "@dr.pogodin/babel-plugin-react-css-modules".
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Attributes {
    styleName?: string;
  }
}
