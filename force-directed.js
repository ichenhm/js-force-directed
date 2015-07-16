var node = {
	x: 0,
	y: 0,
	radius: 3,
	fillcolor: "#000000",
	strokecolor: "#FAEBD7",
	newObject: function () {
		return Object.create(node);
	}
}

var Vector = {
	x: 0,
	y: 0,
	newObject: function(x, y) {
		var temp = Object.create(Vector);
		temp.x = x;
		temp.y = y;
		return temp;
	},
	add: function (v) {
		return Vector.newObject(this.x + v.x, this.y + v.y);
	},
	sub: function (v) {
		return Vector.newObject(this.x - v.x, this.y - v.y);
	},
	length: function () {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},
	length2: function () {
		return this.x * this.x + this.y * this.y;
	},
	negate: function (v) {
		return Vector.newObject(-v.x, -v.y);
	},
	normalize: function () {
		var len = this.length();
		return Vector.newObject(this.x / len, this.y / len);
	},
	mult : function (p) {
		return Vector.newObject(this.x * p, this.y * p);
	}
	
}

var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
var N = 16;
var nodeList = [];
var edgeList = [[1,11],[1,12],[1,13],[1,14],[1,15],[0,2],[2,1],[0,3],[0,4],[4,5],[3,2],[6,5],[3,6],[6,7],[6,8],[6,9],[9,10]];
var matrix = [];
function initialize() {
	for (var i = 0; i < N; i++){
		var n = node.newObject();
		n.x = Math.random() * canvas.width;
		n.y = Math.random() * canvas.height;
		nodeList.push(n);
	}
	
	matrix= new Array();
	for (var i = 0;i < N; i++)
		matrix[i] = new Array(N);
	
	for (var i = 0;i < edgeList.length; i++){
		matrix[edgeList[i][0]][edgeList[i][1]] = true;
		matrix[edgeList[i][1]][edgeList[i][0]] = true;
	}
}
function draw(){
	ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    for (var i = 0; i < edgeList.length; i++) {
        ctx.beginPath();
        ctx.moveTo(nodeList[edgeList[i][0]].x, nodeList[edgeList[i][0]].y);
        ctx.lineTo(nodeList[edgeList[i][1]].x, nodeList[edgeList[i][1]].y);
        ctx.stroke();
    }	
	for (var i = 0; i < N; i++){
     	ctx.beginPath();
		ctx.strokeStyle = nodeList[i].strokeColor;
     	ctx.arc(nodeList[i].x, nodeList[i].y, nodeList[i].radius, 0,
            2 * Math.PI, false);
		ctx.stroke();
	}

}

function attraction(i, j) { // the result can be direct added to i
	var K = 0.1;
	var L = 20;
	if(!matrix[i][j])
        return Vector.newObject(0, 0);
	var att = Vector.newObject(nodeList[i].x - nodeList[j].x, nodeList[i].y - nodeList[j].y);
	var len = att.length();
	
	return att.normalize().mult(K * (L - len));
}
function repulsion(i, j) {   // the result can be direct added to i
	var K = 10000;
	var rep = Vector.newObject(nodeList[i].x - nodeList[j].x, nodeList[i].y - nodeList[j].y);
	var len = rep.length2();
	return rep.normalize().mult(K / len);
}


function render(){
	ctx.clearRect(0, 0, 1000, 800);
	var addv = new Array(N);
	for (var i = 0; i < N; i++) addv[i] = Vector.newObject(0, 0);
	
	for (var i = 0; i < N; i++)
	for (var j = i + 1; j < N; j++){
			
			var v1= attraction(i, j).add(repulsion(i, j));
			addv[i] = addv[i].add(v1);
			addv[j] = addv[j].add(Vector.negate(v1));
		}	
	for (var i = 0; i < N; i++){
		nodeList[i].x += addv[i].x;
		nodeList[i].y += addv[i].y;
	}
	draw();
}

initialize();
setInterval("render()",50);

