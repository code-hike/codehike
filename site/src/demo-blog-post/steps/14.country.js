import Link from "next/link"
import { useRouter } from "next/router"

export default function Country() {
  const router = useRouter()
  const { name } = router.query
  return (
    <>
      <h1 style={{ textAlign: "center" }}>
        {name}
      </h1>
      <Link href="/">
        <a>Go Back</a>
      </Link>
    </>
  )
}
