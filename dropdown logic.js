// Function to update the status of the selected option
function updateSelectedOption1(selectedOptionId1) {
    const options1 = document.querySelectorAll('.dropdown1-content a');
    options1.forEach(option => {
        if (option.id === selectedOptionId1) {
            option.textContent = `✔️ ${option.textContent.replace('✔️ ', '')}`;  // Add a tick
        } else {
            option.textContent = option.textContent.replace('✔️ ', '');  // Remove a tick
        }
    });
}

// Function to update the status of the selected option
function updateSelectedOption2(selectedOptionId2) {
    const options2 = document.querySelectorAll('.dropdown2-content a');
    options2.forEach(option => {
        if (option.id === selectedOptionId2) {
            option.textContent = `✔️ ${option.textContent.replace('✔️ ', '')}`;  // Add a tick
        } else {
            option.textContent = option.textContent.replace('✔️ ', '');  // Remove a tick
        }
    });
}

// Draw dropdown
// Handler for clicking on the "Drag" option
document.getElementById('drag-option').addEventListener('click', () => {
    updateSelectedOption1('drag-option');
    isDragMode = true;  // Switch on the moving mode with LMB
    canvas.style.cursor = 'grab';
    showNotification('drag-option have chosen!', 3000);
});

// Handler for clicking on the "Wire" option
document.getElementById('wire-option').addEventListener('click', () => {
    updateSelectedOption1('wire-option');
    isDragMode = false;  // Enable the mode for moving only with the middle button
    canvas.style.cursor = 'crosshair';
    showNotification('wire-option have chosen!', 3000);
    selectedtool = 'wire';
});

// Handler for clicking on the "Transformer" option
document.getElementById('transformer-option').addEventListener('click', () => {
    updateSelectedOption1('transformer-option');
    isDragMode = false;  // Enable the mode for moving only with the middle button
    canvas.style.cursor = 'crosshair';
});

// Handler for clicking on the "Autotransformer" option
document.getElementById('autotransformer-option').addEventListener('click', () => {
    updateSelectedOption1('autotransformer-option');
    isDragMode = false;  // Enable the mode for moving only with the middle button
    canvas.style.cursor = 'crosshair';
});

// Handler for clicking on the "Synchronous Turbine Generator" option
document.getElementById('generator-option').addEventListener('click', () => {
    updateSelectedOption1('generator-option');
    isDragMode = false;  // Enable the mode for moving only with the middle button
    canvas.style.cursor = 'crosshair';
});



// Settings dropdown
// Handler for clicking on the "Dark mode" option
document.getElementById('dark_mode-option').addEventListener('click', () => {
    updateSelectedOption2('dark_mode-option');
});
// Handler for clicking on the "Standard mode" option
document.getElementById('standard_mode-option').addEventListener('click', () => {
    updateSelectedOption2('standard_mode-option');
});