export default {
  presets: [
    ['../../../config/babel/node-ssr', {
      context: import.meta.dirname,
      typescript: true,
    }],
  ],
};
