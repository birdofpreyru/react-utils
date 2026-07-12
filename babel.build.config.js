export default {
  presets: [
    ['./config/babel/node-ssr', {
      addImportExtensions: true,
      typescript: true,
    }],
  ],
  targets: 'maintained node versions',
};
