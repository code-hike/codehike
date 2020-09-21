import { LandingPage } from "../src/landing"
import { fetchSponsors } from "../src/sponsors-fetch"

export async function getStaticProps() {
  const sponsors = await fetchSponsors()

  return {
    props: {
      sponsors,
    },
  }
}

export default LandingPage
