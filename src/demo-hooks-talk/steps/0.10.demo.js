import React from "react"
import Row from "./row"
import { appear } from "packages/sim-user/sim-user";

export default class Greeting extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef();
    this.state = {
      name: "Mary",
      error: false,
    }
    this.handleNameChange = this.handleNameChange.bind(this)
  }

  handleNameChange(e) {
    this.setState({
      error: true,
    })
  }

  componentDidMount() {
    if (!this.props.sim) { return }
    const node = this.myRef.current;
    const input = node.querySelector("input")
    appear(input, "H")
  }


  render() {
    return this.state.error ? (
      <ErrorOverlay />
    ) : (
      <section ref={this.myRef}>
        <Row label="Name">
          <input
            value={this.state.name}
            onChange={this.handleNameChange}
          />
        </Row>
      </section>
    )
  }
}

function ErrorOverlay() {
  return (
    <div
      style={{
        display: "inline-flex",
        background: "#fafafa",
        flexDirection: "column",
        height: "100%",
        position: "absolute",
        left: 0,
        overflow: "hidden auto",
        padding: "0.5rem",
        boxSizing: "border-box",
        textAlign: "left",
        fontFamily: "Consolas, Menlo, monospace",
        fontSize: "11px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: "1.5",
        color: "rgb(41, 50, 56)",
      }}
    >
      <div
        style={{
          fontSize: "2em",
          fontFamily: "Roboto, sans-serif",
          color: "rgb(206, 17, 38)",
        }}
      >
        TypeError: Cannot read property 'setState' of
        undefined
      </div>
      <div
        style={{
          fontSize: "1em",
          flex: "0 1 auto",
          minHeight: "0px",
          overflow: "auto",
          paddingTop: "1rem",
        }}
      >
        <div>handleNameChange</div>
        <div
          style={{
            fontSize: "0.9em",
            color: "rgb(135, 142, 145)",
          }}
        >
          src/ClassExample.js
        </div>
        <pre
          style={{
            display: "block",
            padding: "0.5em",
            marginTop: "0.5em",
            marginBottom: "0.5em",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            borderRadius: "0.25rem",
            backgroundColor: "rgba(206, 17, 38, 0.05)",
            cursor: "pointer",
          }}
        >
          {`  11 | 
  12 | handleNameChange(e) {`}
          <div
            style={{
              background: "rgb(252, 207, 207)",
              fontWeight: "bold",
            }}
          >{`> 13 |   this.setState({`}</div>
          {`     |       ^
  14 |     name: e.target.value
  15 |   });
  16 | }`}
        </pre>
      </div>
      <div
        style={{
          fontFamily: "sans-serif",
          color: "rgb(135, 142, 145)",
          marginTop: "0.5rem",
          flex: "0 0 auto",
        }}
      >
        This screen is visible only in development. It will
        not appear if the app crashes in production.
        <br />
        Open your browser’s developer console to further
        inspect this error.
      </div>
    </div>
  )
}
