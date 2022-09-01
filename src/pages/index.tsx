import * as React from "react"
import type { HeadFC } from "gatsby"
import {Sigma} from "sigma";
import {GraphVisualizer} from "../components/visualizer";

const IndexPage = () => {
  return (
    <main>
      <h1>Grapheen</h1>
      <br />
      <GraphVisualizer/>
      <br />
      Copyright © 2016-2020 Călin Ilie. Check me out on <a href="https://github.com/calini/graph-visualizer">Github</a>
    </main>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>

