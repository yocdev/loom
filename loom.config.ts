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
      output: 'example/__generated__/icons',
    },
    {
      include: ['example/assets/svgs/*.svg'],
      exclude: [],
      filePrefix: 'Svg',
      output: 'example/__generated__/svgs',
    },
  ],
};
