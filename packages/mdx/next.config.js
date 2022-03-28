module.exports = {
  outputFileTracing: true,
  redirects() {
    return [
      {
        source: "/",
        destination: "/test",
        permanent: false,
      },
    ]
  },
}
