import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'emdr-view',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
      inlineDynamicImports: true,
      externalRuntime: false
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null
    },
  ],
};
