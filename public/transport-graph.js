import cytoscape from "https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.26.0/cytoscape.esm.min.js";

const elements = JSON.parse(document.getElementById("graph").innerHTML);
const cy = cytoscape({
  container: document.getElementById("render"),
  elements,
  style: [
    // the stylesheet for the graph
    {
      selector: "node",
      style: {
        height: 20,
        width: 20,
        color: "#fff",
        "background-color": "#18e018",
        label: "data(label)",
      },
    },

    {
      selector: "edge",
      style: {
        "curve-style": "haystack",
        "haystack-radius": 0,
        width: 5,
        opacity: 0.5,
        "line-color": "#a2efa2",
      },
    },
  ],
  layout: {
    name: "grid",
    rows: 2,
  },
});
