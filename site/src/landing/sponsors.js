import React from "react"
import s from "./sponsors.module.css"

export { Sponsors }

function Sponsors({ sponsors }) {
  const [lastSponsor, ...otherSponsors] = sponsors
  return (
    <section>
      <div>
        {lastSponsor.login} - {lastSponsor.name}
        <img
          src={lastSponsor.avatarUrl}
          style={{ borderRadius: "50%" }}
        />
      </div>
      <ul>
        {otherSponsors.map(s => (
          <li key={s.login}>
            {s.login} - {s.name}
            <img
              src={s.avatarUrl}
              style={{ borderRadius: "50%" }}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
