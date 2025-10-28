// Dynamically set current year
document.getElementById('currentyear').textContent = new Date().getFullYear();

// Dynamically set last modified date
document.getElementById('lastModified').textContent =
  `Last Modified: ${document.lastModified}`;