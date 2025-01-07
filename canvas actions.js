const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

let offsetX = 0, offsetY = 0;
let scale = 1;
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let isDragMode = true; // Default: LMB for dragging
let mouseX = 0, mouseY = 0; // Mouse position

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
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText(`X: ${logicalX.toFixed(2)}, Y: ${logicalY.toFixed(2)}`, 10, 20);
    ctx.restore();
}

// Mouse down event
canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0 && isDragMode) { // Left button for dragging
        isDragging = true;
        dragStartX = e.clientX - offsetX;
        dragStartY = e.clientY - offsetY;
    }
});

// Mouse move event
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - canvas.offsetLeft;
    mouseY = e.clientY - canvas.offsetTop;

    if (isDragging) {
        offsetX = e.clientX - dragStartX;
        offsetY = e.clientY - dragStartY;
    }

    drawGrid();
});

// Mouse up event
canvas.addEventListener('mouseup', () => {
    isDragging = false;
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