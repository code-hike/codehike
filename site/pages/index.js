import { LandingPage } from "src/landing-new"
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
