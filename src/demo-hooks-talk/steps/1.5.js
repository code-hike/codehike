import React from "react"
import Row from "./row"

export default function Greeting(props) {
  const name = ???

  function handleNameChange(e) {
    
  }
  
  return (
    <section>
      <Row label="Name">
        <input 
          value={name}
          onChange={handleNameChange}
        />
      </Row>
    </section>
  )
}
