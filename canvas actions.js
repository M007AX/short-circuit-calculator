const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

let offsetX = 0, offsetY = 0;
let scale = 1;
let isDragging = false;
let dragStartX = 0, dragStartY = 0;
let isDragMode = true;  // Move with the default LMB

// Grid drawing function
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 0.5;

    for (let x = 0; x < canvas.width / scale; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height / scale);
        ctx.stroke();
    }

    for (let y = 0; y < canvas.height / scale; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width / scale, y);
        ctx.stroke();
    }

    ctx.restore();
}

// Event handler for mouse click
canvas.addEventListener('mousedown', (e) => {
    if ((e.button === 0 && isDragMode) || (e.button === 1 && !isDragMode)) {  // LMB for drag, middle button for others
        isDragging = true;
        dragStartX = e.clientX - offsetX;
        dragStartY = e.clientY - offsetY;
    }
});

// Event handler for mouse movement
canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        offsetX = e.clientX - dragStartX;
        offsetY = e.clientY - dragStartY;
        drawGrid();
    }
});

// Event handler for releasing the mouse
canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

// Event handler for mouse wheel (zoom)
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 0.1;
    const zoom = e.deltaY < 0 ? 1 + zoomFactor : 1 - zoomFactor;
    scale *= zoom;

    // Adjusting the offset for zoom relative to the mouse position
    const mouseX = e.clientX - canvas.offsetLeft;
    const mouseY = e.clientY - canvas.offsetTop;

    offsetX -= (mouseX - offsetX) * (zoom - 1);
    offsetY -= (mouseY - offsetY) * (zoom - 1);

    drawGrid();
});

drawGrid();
