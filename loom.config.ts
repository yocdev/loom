export default {
  router: {
    include: ['example/*/index.tsx'],
    exclude: [],
    output: 'example/__generated__/router',
  },
  icon: [
    {
      include: ['example/assets/icons/*.svg'],
      exclude: [],
      filePrefix: 'Icon',
      imageModeOption: {},
      output: 'example/__generated__/icons',
    },
    {
      include: ['example/assets/svgs/*.svg'],
      exclude: [],
      filePrefix: 'Svg',
      imageModeOption: {},
      output: 'example/__generated__/svgs',
    },
  ],
};
