// elements.js

// Class for wire representation
class Wire {
    constructor(startX, startY, endX, endY, type = null) {
        this.startX = startX; // Start point
        this.startY = startY;
        this.endX = endX; // End point
        this.endY = endY;
        this.length = null; // Wire length, user defined
        this.resistance = null; // Wire resistance, to be calculated
    }
}

// Make the class global, add it to the global scope
window.Wire = Wire;
