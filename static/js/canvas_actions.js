const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

let offsetX = 0, offsetY = 0; // Canvas offset
let scale = 1; // Canvas scale
let isDragging = false; // Flag for dragging the canvas
let dragStartX = 0, dragStartY = 0; // Drag start position
let isDragMode = true; // Default: LMB for dragging
let mouseX = 0, mouseY = 0; // Mouse position
let startX = null, startY = null; // Starting point for drawing
let isDrawing = false; // Flag for drawing

let endX = null, endY = null; // End point for drawing

// Array to store all nodes
let nodes = [];
// Array to store all wires
let wires = [];

// Function to convert logical coordinates to canvas coordinates
function toCanvasCoords(logicalX, logicalY) {
    return {
        x: logicalX * scale + offsetX,
        y: logicalY * scale + offsetY
    };
}

// Function to convert canvas coordinates to logical coordinates
function toLogicalCoords(canvasX, canvasY) {
    return {
        x: (canvasX - offsetX) / scale,
        y: (canvasY - offsetY) / scale
    };
}

// Function to draw the grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the grid
    ctx.save();
    ctx.translate(offsetX, offsetY); // Apply translation
    ctx.scale(scale, scale); // Apply scaling

    ctx.strokeStyle = "#444";
    ctx.lineWidth = 0.5;

    // Draw grid lines
    const gridSize = 50;
    const startX = -offsetX / scale;
    const startY = -offsetY / scale;
    const endX = startX + canvas.width / scale;
    const endY = startY + canvas.height / scale;

    for (let x = Math.floor(startX / gridSize) * gridSize; x < endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
    }

    for (let y = Math.floor(startY / gridSize) * gridSize; y < endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
    }

    ctx.restore();

    // Draw all wires
    wires.forEach(wire => {
        drawWire(wire, false);
    });

    // Draw all nodes
    nodes.forEach(node => {
        drawNode(node, false);
    });

    // Highlight elements on hover
    highlightElements();

    // Draw the current mouse position
    drawMousePosition();
}

// Function to draw a wire
function drawWire(wire, isHighlighted) {
    const start = toCanvasCoords(wire.startX, wire.startY);
    const end = toCanvasCoords(wire.endX, wire.endY);

    // Draw the wire line
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = isHighlighted ? "cyan" : "white"; // Highlight color
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw a circle at the start point
    ctx.beginPath();
    ctx.arc(start.x, start.y, 20 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = isHighlighted ? "cyan" : "#202020";  // Highlight color
    ctx.fill();
    ctx.strokeStyle = "white";  // Stroke color
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw a circle at the end point
    ctx.beginPath();
    ctx.arc(end.x, end.y, 20 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = isHighlighted ? "cyan" : "#202020";  // Highlight color
    ctx.fill();
    ctx.strokeStyle = "white";  // Stroke color
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Function to draw a node
function drawNode(node, isHighlighted) {
    const coords = toCanvasCoords(node.x, node.y);

    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 20 * scale, 0, 2 * Math.PI);
    ctx.fillStyle = isHighlighted ? "cyan" : "#202020";  // Highlight color
    ctx.fill();
    ctx.strokeStyle = "white";  // Stroke color
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Function to highlight elements on hover
function highlightElements() {
    const rect = canvas.getBoundingClientRect();
    const mouseCanvasX = mouseX - rect.left;
    const mouseCanvasY = mouseY - rect.top;
    const logicalCoords = toLogicalCoords(mouseCanvasX, mouseCanvasY);

    // Check if the mouse is over a node
    nodes.forEach(node => {
        const distance = Math.hypot(node.x - logicalCoords.x, node.y - logicalCoords.y);
        if (distance < 20 / scale) { // Node radius
            drawNode(node, true); // Highlight the node
        }
    });

    // Check if the mouse is over a wire
    wires.forEach(wire => {
        const start = toCanvasCoords(wire.startX, wire.startY);
        const end = toCanvasCoords(wire.endX, wire.endY);
        const mouseXCanvas = mouseCanvasX;
        const mouseYCanvas = mouseCanvasY;

        // Calculate the distance from the mouse to the wire
        const distance = distanceToLine(mouseXCanvas, mouseYCanvas, start.x, start.y, end.x, end.y);
        if (distance < 10) { // Wire highlight threshold
            drawWire(wire, true); // Highlight the wire
        }
    });
}

// Function to calculate the distance from a point to a line
function distanceToLine(x, y, x1, y1, x2, y2) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) {
        param = dot / lenSq;
    }

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.hypot(dx, dy);
}

// Function to draw the mouse position
function drawMousePosition() {
    const logicalX = (mouseX - offsetX) / scale;
    const logicalY = (mouseY - offsetY) / scale;

    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(`X: ${logicalX.toFixed(2)}, Y: ${logicalY.toFixed(2)}`, 10, 20);
    ctx.restore();
}

// Mouse down event
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0 && isDragMode && !isDrawing) { // LMB for dragging
        // Start dragging
        isDragging = true;
        dragStartX = e.clientX - offsetX;
        dragStartY = e.clientY - offsetY;
    }
    else if (e.button === 0 && !isDragMode && !isDrawing) { // LMB for drawing
        // Calculate the position on the canvas
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Snap to the nearest grid node
        const logicalX = (mouseX - offsetX) / scale;
        const logicalY = (mouseY - offsetY) / scale;
        const gridSize = 50;

        const snapX = Math.round(logicalX / gridSize) * gridSize;
        const snapY = Math.round(logicalY / gridSize) * gridSize;

        // Check if a node already exists at this position
        let existingNode = nodes.find(node => node.x === snapX && node.y === snapY);
        if (!existingNode) {
            // Create a new node
            existingNode = {
                type: 'node',
                x: snapX,
                y: snapY
            };
            nodes.push(existingNode);
        }

        // Convert back to canvas coordinates
        startX = snapX * scale + offsetX;
        startY = snapY * scale + offsetY;

        // Start drawing
        isDrawing = true;
    }
    else if (e.button === 2) { // RMB to add a node
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Convert mouse coordinates to logical coordinates
        const logicalX = (mouseX - offsetX) / scale;
        const logicalY = (mouseY - offsetY) / scale;


        // Redraw the canvas
        drawGrid();
    }
});

// Mouse move event
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    if (isDragging) {
        offsetX = e.clientX - dragStartX;
        offsetY = e.clientY - dragStartY;
        drawGrid();
    }

    if (isDrawing) {
        // Calculate the current mouse position
        const logicalX = (mouseX - offsetX) / scale;
        const logicalY = (mouseY - offsetY) / scale;
        const gridSize = 50;

        const snapX = Math.round(logicalX / gridSize) * gridSize;
        const snapY = Math.round(logicalY / gridSize) * gridSize;

        // Convert back to canvas coordinates
        const snapCanvasX = snapX * scale + offsetX;
        const snapCanvasY = snapY * scale + offsetY;

        // Clear the canvas and draw the grid and initial circle
        drawGrid();

        // Draw a line from the start point to the current point
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(snapCanvasX, snapCanvasY);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
});

// Mouse up event
canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        // Draw the end circle at the final position
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Snap to the nearest grid node
        const logicalX = (mouseX - offsetX) / scale;
        const logicalY = (mouseY - offsetY) / scale;
        const gridSize = 50;

        const snapX = Math.round(logicalX / gridSize) * gridSize;
        const snapY = Math.round(logicalY / gridSize) * gridSize;

        // Check if a node already exists at this position
        let existingNode = nodes.find(node => node.x === snapX && node.y === snapY);
        if (!existingNode) {
            // Create a new node
            existingNode = {
                type: 'node',
                x: snapX,
                y: snapY
            };
            nodes.push(existingNode);
        }

        // Convert back to canvas coordinates
        endX = snapX * scale + offsetX;
        endY = snapY * scale + offsetY;

        // Check that the start and end points do not coincide
        if (startX !== endX || startY !== endY) {
            // Create a new wire and add it to the array
            const newWire = {
                type: 'wire',
                startX: (startX - offsetX) / scale,
                startY: (startY - offsetY) / scale,
                endX: (endX - offsetX) / scale,
                endY: (endY - offsetY) / scale
            };
            wires.push(newWire);

            // Redraw the canvas
            drawGrid();
        }

        // Reset drawing state
        isDrawing = false;
    }

    if (isDragging) {
        isDragging = false;
    }
});

// Mouse wheel (zoom) event
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();

    const zoomFactor = 0.1;
    const zoom = e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;

    // Calculate new scale
    const newScale = scale * zoom;

    // Limit the scale to [0.1, 5]
    if (newScale >= 0.1 && newScale <= 5) {
        // Calculate the zoom point relative to the mouse
        const rect = canvas.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left - offsetX) / scale;
        const mouseY = (e.clientY - rect.top - offsetY) / scale;

        // Apply scale
        scale = newScale;

        // Adjust the offset to maintain the mouse position
        offsetX -= mouseX * (zoom - 1) * scale;
        offsetY -= mouseY * (zoom - 1) * scale;

        drawGrid();
    }
});

// Resize canvas to fit window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawGrid();
}

window.addEventListener('resize', resizeCanvas);

// Initialize
resizeCanvas();