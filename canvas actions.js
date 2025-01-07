const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

let offsetX = 0, offsetY = 0;
let scale = 1;
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let isDragMode = true; // Default: LMB for dragging
let mouseX = 0, mouseY = 0; // Mouse position
let startX = null, startY = null;  // Starting point
let isDrawing = false;  // Flag for drawing

let endX = null, endY = null;

// Grid drawing function
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
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

    // Draw mouse position
    drawMousePosition();
}

// Function to draw mouse position
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
        // Calculating the position on the canvas
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Tie to the nearest mesh node
        const logicalX = (mouseX - offsetX) / scale;
        const logicalY = (mouseY - offsetY) / scale;
        const gridSize = 50;

        const snapX = Math.round(logicalX / gridSize) * gridSize;
        const snapY = Math.round(logicalY / gridSize) * gridSize;

        // Convert back to kanvas coordinates
        startX = snapX * scale + offsetX;
        startY = snapY * scale + offsetY;

        // Начинаем рисовать
        isDrawing = true;

        // Draw a coloured circle at the starting point
        ctx.beginPath();
        ctx.arc(startX, startY, 20 * scale, 0, 2 * Math.PI);
        ctx.fillStyle = "#202020";  // Fill
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
});

// Mouse move event
canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        offsetX = e.clientX - dragStartX;
        offsetY = e.clientY - dragStartY;
        drawGrid();
    }

    if (isDrawing) {
        // Calculate the current mouse position
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Tie to the nearest mesh node
        const logicalX = (mouseX - offsetX) / scale;
        const logicalY = (mouseY - offsetY) / scale;
        const gridSize = 50;

        const snapX = Math.round(logicalX / gridSize) * gridSize;
        const snapY = Math.round(logicalY / gridSize) * gridSize;

        // Convert back to kanvas coordinates
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

        // Tie to the nearest mesh node
        const logicalX = (mouseX - offsetX) / scale;
        const logicalY = (mouseY - offsetY) / scale;
        const gridSize = 50;

        const snapX = Math.round(logicalX / gridSize) * gridSize;
        const snapY = Math.round(logicalY / gridSize) * gridSize;

        // Convert back to kanvas coordinates
        endX = snapX * scale + offsetX;
        endY = snapY * scale + offsetY;

        // Check that the start and end points do not coincide
        if (startX !== endX || startY !== endY) {

            // Draw the line from the start point to the end point
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw the start circle
            ctx.beginPath();
            ctx.arc(startX, startY, 20 * scale, 0, 2 * Math.PI);
            ctx.fillStyle = "#202020";  // Fill
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw the end circle
            ctx.beginPath();
            ctx.arc(endX, endY, 20 * scale, 0, 2 * Math.PI);
            ctx.fillStyle = "#202020";  // Fill
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();
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
        // Рассчитать точку масштабирования относительно мыши
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