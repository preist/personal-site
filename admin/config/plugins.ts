export default ({ env: _env }) => ({
  upload: {
    config: {
      sizeLimit: 100000000, // 100MB limit
    },
  },
  seo: {
    enabled: true,
  },
});
