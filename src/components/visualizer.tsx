import React, {useEffect, useState} from "react";
import Graph, {MultiDirectedGraph} from "graphology";
import {SigmaContainer, useLoadGraph, useRegisterEvents, useSigma} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import ForceSupervisor from "graphology-layout-force/worker";
import chroma from "chroma-js";
import {useWorkerLayoutForce} from "@react-sigma/layout-force";
import sigma from "sigma";

export const LoadGraph = () => {
    const sigma = useSigma();
    const loadGraph = useLoadGraph();
    const registerEvents = useRegisterEvents();
    const {stop, start, kill, isRunning} = useWorkerLayoutForce({})

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

        let isDragging = false;
        let draggedNode:String = "";

        registerEvents({
            mouseup: event => {
                console.log("mouse up");

                if (draggedNode) {
                    graph.removeNodeAttribute(draggedNode, "highlighted");
                }
                isDragging = false;
                draggedNode = "";
            },
            downNode: event => {
                console.log("mouse down on a node", event.event.x, event.event.y)
                isDragging = true;
                draggedNode = event.node;
                graph.setNodeAttribute(draggedNode, "highlighted", true);
            },
            mousemove: event => {
                if (isDragging) {
                    let pos = sigma.viewportToGraph(event);
                    graph.setNodeAttribute(draggedNode, "x", pos.x);
                    graph.setNodeAttribute(draggedNode, "y", pos.y);

                    // Prevent sigma to move camera:
                    event.preventSigmaDefault();
                    event.original.preventDefault();
                    event.original.stopPropagation();
                }
            }

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
