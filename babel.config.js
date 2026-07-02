export default {
  presets: [
    ['./config/babel/node-ssr', {
      typescript: true,
    }],
  ],
  targets: 'maintained node versions',
};
