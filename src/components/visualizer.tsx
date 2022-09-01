import React, {useEffect, useState} from "react";
import Graph, {MultiDirectedGraph} from "graphology";
import { SigmaContainer, useLoadGraph, useRegisterEvents} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import ForceSupervisor from "graphology-layout-force/worker";
import chroma from "chroma-js";
import {useWorkerLayoutForce} from "@react-sigma/layout-force";

export const LoadGraph = () => {
    const loadGraph = useLoadGraph();
    const registerEvents = useRegisterEvents();
    const {stop, start, kill, isRunning} = useWorkerLayoutForce({})

    const [count, setCount] = useState(0);

    /*
      settings: {
      attributes?: {
        weight?: string;
      };
      settings?: ForceAtlas2Settings;
      weighted?: boolean;
      outputReducer?: (key: string, attributes: any) => any;
    }*/

    useEffect(() => {
        const graph = new MultiDirectedGraph();
        graph.addNode("n1", { x: 0, y: 0, size: 10, color: chroma.random().hex() });
        graph.addNode("n2", { x: -5, y: 5, size: 10, color: chroma.random().hex() });
        graph.addNode("n3", { x: 5, y: 5, size: 10, color: chroma.random().hex() });
        graph.addNode("n4", { x: 0, y: 10, size: 10, color: chroma.random().hex() });
        graph.addEdge("n1", "n2");
        graph.addEdge("n2", "n3");
        graph.addEdge("n3", "n4");
        graph.addEdge("n4", "n1");
        graph.addEdge("n1", "n3");

        loadGraph(graph);

        start();

        registerEvents({
            mouseup: event => {
                console.log("mouseup", event.x, event.y)
            },
            downNode: event => {
                console.log("mouse down on a node", event.event.x, event.event.y)
            },
        })


        }, [loadGraph, start, registerEvents]);

    return null;
};

export const GraphVisualizer = () => {
    return (
        <SigmaContainer style={{ height: "500px", width: "500px" }}>
            <LoadGraph />
        </SigmaContainer>
    );
};
