import React from "react"
import Row from "./row"
import { appear } from "packages/sim-user/sim-user";

export default class Greeting extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef();
    this.state = {
      name: "Mary",
    }
    this.handleNameChange = this.handleNameChange.bind(this)
  }

  handleNameChange(e) {
    this.setState({ 
      name: e.target.value
    })
  }

  componentDidMount() {
    const node = this.myRef.current;
    const input = node.querySelector("input")
    appear(input, "Harry")
  }

  render() {
    return (
      <section ref={this.myRef}>
        <Row label="Name">
          <input value={this.state.name} onChange={this.handleNameChange}/>
        </Row>
      </section>
    )
  }
}
