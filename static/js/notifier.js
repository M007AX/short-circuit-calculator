// notifier.js

function showNotification(message, duration = 3000) {
    const container = document.getElementById('notifier-container');

    // Create a new notification element
    const notification = document.createElement('div');
    notification.className = 'notifier';
    notification.textContent = message;

    // Append the notification to the container
    container.appendChild(notification);

    // Remove the notification after the specified duration
    setTimeout(() => {
        notification.remove();
    }, duration + 500); // Add extra time to account for the fade-out animation
}

// Expose the function to the global scope
window.showNotification = showNotification;