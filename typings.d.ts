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
  export default string;
}

declare namespace React {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    // This allows all JSX elements to have additional "styleName" attribute,
    // handled by "@dr.pogodin/babel-plugin-react-css-modules".
    styleName?: string;
  }
}
