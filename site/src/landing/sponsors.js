import React from "react"
import s from "./sponsors.module.css"

export { Sponsors }

function Sponsors({ sponsors }) {
  return (
    <section>
      <ul className={s.sponsors}>
        {sponsors.map(sponsor => (
          <li key={sponsor.login}>
            <a className={s.sponsor} href={sponsor.url}>
              <img src={sponsor.avatarUrl} />
              <div className={s.details}>
                <h4>{sponsor.name}</h4>
                <span className={s.login}>
                  {sponsor.login}
                </span>
                <span className={s.location}>
                  {sponsor.location}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <a
        href="https://github.com/sponsors/code-hike"
        className={s.button}
      >
        Sponsor Code Hike
      </a>
    </section>
  )
}
