// drawing.js

// Current tool selection
let tool = null;

// Function to select a tool
function selectTool(selectedTool) {
    tool = selectedTool;
    canvas.style.cursor = tool === 'wire' ? 'crosshair' : 'default';
}

// Variables for drawing wire
let isDrawingWire = false;
let startNode = null;

// Mouse events for wire drawing
canvas.addEventListener('mousedown', (e) => {
    if (tool !== 'wire' && tool !== 'transformer' && tool !== 'autotransformer' && tool !== 'generator') return;


    const { x, y } = toLogicalCoords(e.clientX, e.clientY);

    // Find the nearest node
    let nearestNode = null;
    let minDistance = Infinity;
    nodes.forEach((node, index) => {
        const distance = Math.hypot(node.x - x, node.y - y);
        if (distance < NODE_RADIUS / scale && distance < minDistance) {
            nearestNode = node;
            minDistance = distance;
        }
    });

    if (nearestNode) {
        if (!isDrawingWire) {
            // Start drawing
            startNode = nearestNode;
            isDrawingWire = true;
        } else {
            // Finish drawing
            if (nearestNode !== startNode) {
                addWire(nodes.indexOf(startNode), nodes.indexOf(nearestNode));
            }
            isDrawingWire = false;
            startNode = null;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (tool !== 'wire' || !isDrawingWire || !startNode) return;

    const { x, y } = toLogicalCoords(e.clientX, e.clientY);
    const { x: startX, y: startY } = toCanvasCoords(startNode.x, startNode.y);
    const { x: endX, y: endY } = toCanvasCoords(x, y);

    redraw(); // Clear and redraw the canvas
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // Dashed line
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash
});

canvas.addEventListener('mouseup', (e) => {
    if (tool !== 'wire' || !isDrawingWire) return;

    const { x, y } = toLogicalCoords(e.clientX, e.clientY);

    // Find the nearest node
    let nearestNode = null;
    let minDistance = Infinity;
    nodes.forEach((node, index) => {
        const distance = Math.hypot(node.x - x, node.y - y);
        if (distance < NODE_RADIUS / scale && distance < minDistance) {
            nearestNode = node;
            minDistance = distance;
        }
    });

    if (nearestNode && nearestNode !== startNode) {
        addWire(nodes.indexOf(startNode), nodes.indexOf(nearestNode));
    }

    // Reset states
    isDrawingWire = false;
    startNode = null;
    redraw();
});
