import React from "react"
import s from "./sponsors.module.css"

export { Sponsors }

function Sponsors({ sponsors }) {
  return (
    <section>
      <ul className={s.sponsors}>
        {sponsors.map(sponsor => (
          <li key={s.login} tabIndex={5}>
            <div className={s.sponsor}>
              <img src={sponsor.avatarUrl} />
              <div className={s.details}>
                <h4>{sponsor.name}</h4>
                <span>{sponsor.login}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
