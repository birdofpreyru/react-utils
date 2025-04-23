/* eslint-disable import/no-extraneous-dependencies */

// TODO: Double-check that let does not work?
// eslint-disable-next-line no-var
declare var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;

// eslint-disable-next-line no-var
declare var REACT_UTILS_FORCE_CLIENT_SIDE: boolean | undefined;

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

// TODO: This should be done inside my CSURF fork itself.
declare module '@dr.pogodin/csurf' {
  import F from 'csurf';

  export default F;
}

declare module 'node-forge/lib/forge' {
  import F from 'node-forge';

  export default F;
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
