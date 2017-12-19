// Author: Calin Ilie
// Revamp: 2017

// Returns a random color
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Instantiate the graph
var graph = new Springy.Graph();

// Creates a random adjancy matrix and then renders it
function loadRandomGraph() {
	// exemplu
	var n = Math.random() * 4 + 6; // numar intre 6 si 10
	var a = [];
	var text = ""; // folosit pentru a umple textboxul cu matricea de adiacenta creata aleator

	for (var i = 0; i < n; i++) {
		a[i] = [];
		for (var j = 0; j < n; j++) {
			if (i!=j) {
				a[i][j] = (Math.random() < .4); // 40% sansa de 0, 60 de 1
			} else {
				a[i][j] = 0;
			}
			
			text += (a[i][j] ? "1" : "0") + " ";
		}
		text += "\n";
	}
	$('#input-text-box').val(text);
	loadGraphFromMatrix(n, a);
};

// TODO: Not reliable
function loadRandomConnectedGraph() {
	// marime matrice
	var n = Math.floor(Math.random() * 4 + 12); // numar intre 12 si 16

	// generarea matricei goale (JS)
	var a =[];
	for (var i = 0; i < n; i++) {
		a[i] = [];
		for (var j = 0; j < n; j++) {
			a[i][j] = 0;
		}
	}

	var text = ""; // folosit pentru a umple textboxul cu matricea de adiacenta creata aleator

	var v = []; // vizitate pana acum
	var nrV = 0; // numarul de noduri vizitate

	var currentNode = Math.floor(Math.random()*n); // alege un prim nod
	v[currentNode] = 1;
	nrV++;

	while(nrV < n) { // cat timp exista noduri nevizitate
		do {
			var newNode = Math.floor(Math.random()*n);  // gaseste un nod nevizitat
		} while(v[newNode] == 1);

		v[newNode] = 1; // il viziteaza
		nrV++;

		a[currentNode][newNode] = a[newNode][currentNode] = 1; // conecteaza newNode de currentNode

		do {
			var currentNode = Math.floor(Math.random()*n);  // gaseste un nod vizitat de la care sa continue
		} while(v[currentNode] != 1);
	}

	for (var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			text += a[i][j] + " ";
		}
		text += "\n";
	}

	$('#input-text-box').val(text);
	loadGraphFromMatrix(n, a);
};

// Renders the graph from user input or one at random
function render() {
	switch ($('input[name=type]:checked').val()) {
    case "adjacency":
    	parseAdjacencyMatrix();
        break;
    case "edgelist":
    	parseEdgeList();
    	break;
    case "neconex":
    	loadRandomGraph();
    	break;
    case "conex":
    	loadRandomConnectedGraph();
    	break;
    }
}

// Takes user input as adjacency matrix and renders it
function parseAdjacencyMatrix() {
	var textbox = $('#input-text-box').val();
	var rows = textbox.split("\n");
	var n = rows.length;

	// Deletes possible empty row at the end
	if (rows[n-1] == "") {
		delete rows[n-1];
		n--;
	}

	// Init array
	var a = []; 
	for (var i = 0; i < n; i++) {
		a[i] = rows[i].split(" "); 
	}

	loadGraphFromMatrix(n, a);
}

// Takes user input as edge list and renders it
function parseEdgeList() {

	var textbox = $('#input-text-box').val();
	var rows = textbox.split("\n");
	var m = rows.length;

	// Deletes possible empty row at the end
	if (rows[m-1] == "") {
		rows.length--;
		m--;
	}

	// Initialize list
	var edgelist = []; 
	for (var i = 0; i < m; i++) {
		var row = rows[i];
		edgelist[i] = row.split(" "); 
	}

	// gaseste valoarea maxima
	var n = 0;
	for (var i = 0; i < m; i++) {
		if(edgelist[i][0] > n)
			n = parseInt(edgelist[i][0]);
		if(edgelist[i][1] > n)
			n = parseInt(edgelist[i][1]);
	}

	// Initialize matrix
	var a = []; 
	for (var i = 0; i < n; i++) {
		a[i] = [];
		for (var j = 0; j < n; j++) {
			a[i][j] = 0; 
		}
	}
	
	for (var i = 0; i < m; i++) {
		var pair = edgelist[i];
		a[pair[0]-1][pair[1]-1] = 1;
	} 
	
	loadGraphFromMatrix(n, a);
}


// Renders and adjacency matrix
function loadGraphFromMatrix(n, a) {
	// TODO: WHY THIS?
	graph.clear();

	// Adds nodes
	var nodes = [];
	for (var i = 1; i <= n; i++)
		nodes[i] = graph.newNode({label: i});


	// Adds edges
	for (var i = 1; i <= n; i++)
		for (var j = 1; j <= n; j++)
			if (a[i-1][j-1] == 1) {
				graph.newEdge(nodes[i], nodes[j], {color: getRandomColor()});
			}
};

// Creates graph
function makeGraph() {

	var springy = window.springy = $('#springydemo').springy({
		graph: graph,     
		nodeSelected: function(node){
	    	console.log('Node selected: ' + JSON.stringify(node.data));
		} 
	});
};

// Starts app when document is ready
jQuery(document).ready(function(){
	makeGraph();
	loadRandomGraph();
});
