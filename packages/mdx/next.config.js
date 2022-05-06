module.exports = {
  reactStrictMode: true,
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
