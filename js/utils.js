/**
 * Utility functions for Iron Man HUD Interface
 */

// Global variables
const HUD = {
  // Configuration
  config: {
    colors: {
      primary: '#00a2ff',
      secondary: '#00ffff',
      accent: '#ffffff',
      background: 'rgba(0, 10, 20, 0.8)',
      glow: 'rgba(0, 162, 255, 0.6)'
    },
    animations: {
      duration: 0.5,
      stareActivationTime: 1.5 // seconds
    },
    eyeTracking: {
      enabled: true,
      calibrationPoints: 9,
      cameraRotationFactor: 0.05
    }
  },
  
  // State management
  state: {
    isLoading: true,
    isCalibrating: false,
    isInitialized: false,
    gazePosition: { x: 0, y: 0 },
    lastGazePosition: { x: 0, y: 0 },
    focusedElement: null,
    focusStartTime: 0,
    notifications: [],
    systemStatus: {
      arcReactorPower: 85,
      systemIntegrity: 98,
      shieldStatus: 76,
      propulsionPower: 92
    },
    targets: []
  },
  
  // Element references
  elements: {
    loadingScreen: null,
    calibrationScreen: null,
    hudInterface: null,
    progressBar: null,
    gazeDot: null,
    notificationsContainer: null
  },
  
  // Three.js objects
  three: {
    scene: null,
    camera: null,
    renderer: null,
    clock: null,
    raycaster: null,
    mouse: null,
    hudObjects: {}
  }
};

/**
 * Generate a random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Format number with leading zeros
 * @param {number} num - Number to format
 * @param {number} length - Desired length
 * @returns {string} Formatted number
 */
function formatNumber(num, length = 2) {
  return num.toString().padStart(length, '0');
}

/**
 * Generate random system data for HUD elements
 * @returns {Object} Random system data
 */
function generateRandomSystemData() {
  return {
    cpuUsage: Math.floor(randomBetween(20, 95)),
    memoryUsage: Math.floor(randomBetween(30, 85)),
    temperature: Math.floor(randomBetween(35, 75)),
    networkLatency: Math.floor(randomBetween(5, 100))
  };
}

/**
 * Create a notification in the HUD
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {number} duration - Duration in seconds (0 for permanent)
 */
function createNotification(title, message, duration = 5) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  
  const notificationTitle = document.createElement('div');
  notificationTitle.className = 'notification-title';
  notificationTitle.textContent = title;
  
  const notificationBody = document.createElement('div');
  notificationBody.className = 'notification-body';
  notificationBody.textContent = message;
  
  notification.appendChild(notificationTitle);
  notification.appendChild(notificationBody);
  
  HUD.elements.notificationsContainer.appendChild(notification);
  
  // Add to state
  const notificationObj = {
    id: Date.now(),
    element: notification,
    title,
    message,
    timestamp: new Date()
  };
  
  HUD.state.notifications.push(notificationObj);
  
  // Remove after duration
  if (duration > 0) {
    setTimeout(() => {
      notification.style.animation = 'slide-in 0.5s reverse forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        // Remove from state
        const index = HUD.state.notifications.findIndex(n => n.id === notificationObj.id);
        if (index !== -1) {
          HUD.state.notifications.splice(index, 1);
        }
      }, 500);
    }, duration * 1000);
  }
  
  return notificationObj;
}

/**
 * Update loading progress
 * @param {number} progress - Progress percentage (0-100)
 */
function updateLoadingProgress(progress) {
  if (HUD.elements.progressBar) {
    HUD.elements.progressBar.style.width = `${progress}%`;
  }
}

/**
 * Show element with fade-in animation
 * @param {HTMLElement} element - Element to show
 * @param {Function} callback - Callback after animation
 */
function showElement(element, callback) {
  element.style.display = 'flex';
  element.style.opacity = '0';
  
  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transition = 'opacity 0.5s ease';
    
    if (callback) {
      setTimeout(callback, 500);
    }
  }, 10);
}

/**
 * Hide element with fade-out animation
 * @param {HTMLElement} element - Element to hide
 * @param {Function} callback - Callback after animation
 */
function hideElement(element, callback) {
  element.style.opacity = '0';
  element.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    element.style.display = 'none';
    
    if (callback) {
      callback();
    }
  }, 500);
}

/**
 * Calculate distance between two points
 * @param {Object} point1 - First point {x, y}
 * @param {Object} point2 - Second point {x, y}
 * @returns {number} Distance
 */
function calculateDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + 
    Math.pow(point2.y - point1.y, 2)
  );
}

/**
 * Check if user is staring at an element
 * @param {Object} gazePoint - Current gaze point {x, y}
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if staring at element
 */
function isGazeOnElement(gazePoint, element) {
  const rect = element.getBoundingClientRect();
  return (
    gazePoint.x >= rect.left &&
    gazePoint.x <= rect.right &&
    gazePoint.y >= rect.top &&
    gazePoint.y <= rect.bottom
  );
}

/**
 * Generate timestamp string
 * @returns {string} Formatted timestamp
 */
function generateTimestamp() {
  const now = new Date();
  const hours = formatNumber(now.getHours());
  const minutes = formatNumber(now.getMinutes());
  const seconds = formatNumber(now.getSeconds());
  const milliseconds = formatNumber(now.getMilliseconds(), 3);
  
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

/**
 * Create a radial gradient texture
 * @param {number} size - Texture size
 * @param {string} innerColor - Inner color
 * @param {string} outerColor - Outer color
 * @returns {THREE.Texture} Radial gradient texture
 */
function createRadialGradientTexture(size, innerColor, outerColor) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(1, outerColor);
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  
  return texture;
}

/**
 * Create a circular progress indicator
 * @param {number} radius - Radius
 * @param {number} thickness - Line thickness
 * @param {number} progress - Progress (0-1)
 * @param {string} color - Color
 * @returns {THREE.Mesh} Circular progress mesh
 */
function createCircularProgress(radius, thickness, progress, color) {
  const segments = 64;
  const arc = Math.PI * 2 * progress;
  
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * arc;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    vertices.push(x, y, 0);
  }
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  
  const material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: thickness,
    transparent: true,
    opacity: 0.8
  });
  
  return new THREE.Line(geometry, material);
}

/**
 * Lerp (Linear interpolation) between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
