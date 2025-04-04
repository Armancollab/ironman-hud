/**
 * Main application for Iron Man HUD Interface
 */

// Global variables
let hudElements;
let hudCanvas;
let hudEffects;
let hudVoice;
let eyeTracking;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize HUD elements
  HUD.elements.loadingScreen = document.getElementById('loading-screen');
  HUD.elements.calibrationScreen = document.getElementById('calibration-screen');
  HUD.elements.hudInterface = document.getElementById('hud-interface');
  HUD.elements.progressBar = document.querySelector('.progress-bar');
  HUD.elements.gazeDot = document.getElementById('gaze-dot');
  HUD.elements.notificationsContainer = document.getElementById('notifications-container');
  
  // Start loading sequence
  initializeApplication();
});

/**
 * Initialize application
 */
async function initializeApplication() {
  // Simulate loading progress
  simulateLoading(() => {
    // Initialize Three.js scene
    initThreeJS();
    
    // Initialize HUD elements
    hudElements = new HUDElements();
    
    // Initialize Canvas HUD elements
    hudCanvas = new HUDCanvas();
    hudCanvas.init();
    
    // Initialize HUD effects
    hudEffects = new HUDEffects();
    hudEffects.init();
    
    // Initialize HUD voice
    hudVoice = new HUDVoice();
    hudVoice.init();
    
    // Initialize eye tracking
    eyeTracking = new EyeTracking();
    
    // Setup event listeners
    setupEventListeners();
    
    // Show calibration screen
    showCalibrationScreen();
  });
}

/**
 * Simulate loading progress
 * @param {Function} callback - Callback after loading
 */
function simulateLoading(callback) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      updateLoadingProgress(progress);
      
      setTimeout(() => {
        hideElement(HUD.elements.loadingScreen, callback);
      }, 500);
    } else {
      updateLoadingProgress(progress);
    }
  }, 200);
}

// Create ThreeScene instance
const threeScene = new ThreeScene();

/**
 * Initialize Three.js scene
 */
function initThreeJS() {
  // Initialize the enhanced Three.js scene
  threeScene.init();
  
  // Store references in HUD object for compatibility with existing code
  HUD.three.scene = threeScene.scene;
  HUD.three.camera = threeScene.camera;
  HUD.three.renderer = threeScene.renderer;
  HUD.three.clock = threeScene.clock;
  HUD.three.hudObjects = threeScene.objects;
  
  // Create raycaster for interactions
  HUD.three.raycaster = new THREE.Raycaster();
  HUD.three.mouse = new THREE.Vector2();
}

/**
 * Animation loop
 */
function animate() {
  // Animation is now handled by the ThreeScene class
  
  // Update HUD elements
  if (hudElements && HUD.state.isInitialized) {
    hudElements.update();
  }
  
  // Update camera based on gaze if eye tracking is active
  if (eyeTracking && eyeTracking.isTracking && threeScene.camera) {
    threeScene.updateCameraFromGaze(HUD.state.gazePosition);
  }
}

/**
 * Show calibration screen
 */
function showCalibrationScreen() {
  // Play startup effect
  hudEffects.effects.notification.play({
    duration: 1500,
    sound: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAA8DcWTzYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='
  }, () => {
    // Play welcome voice if available
    if (hudVoice && hudVoice.initialized) {
      hudVoice.speak(hudVoice.getGreetingPhrase(), () => {
        // Initialize eye tracking after voice greeting
        eyeTracking.init().then(success => {
          if (success) {
            // Show calibration screen
            showElement(HUD.elements.calibrationScreen);
          } else {
            // Skip calibration and show HUD directly
            showElement(HUD.elements.hudInterface);
            
            // Initialize HUD elements
            hudElements.init();
            
            // Set initialized state
            HUD.state.isInitialized = true;
            
            // Create welcome notification
            createNotification('JARVIS ONLINE', 'All systems operational. Iron Man HUD interface activated.', 5);
            
            // Play scan effect after a delay
            setTimeout(() => {
              hudEffects.effects.scan.play({
                duration: 3000
              });
            }, 1000);
          }
        });
      });
    } else {
      // Initialize eye tracking without voice
      eyeTracking.init().then(success => {
        if (success) {
          // Show calibration screen
          showElement(HUD.elements.calibrationScreen);
        } else {
          // Skip calibration and show HUD directly
          showElement(HUD.elements.hudInterface);
          
          // Initialize HUD elements
          hudElements.init();
          
          // Set initialized state
          HUD.state.isInitialized = true;
          
          // Create welcome notification
          createNotification('JARVIS ONLINE', 'All systems operational. Iron Man HUD interface activated.', 5);
          
          // Play scan effect after a delay
          setTimeout(() => {
            hudEffects.effects.scan.play({
              duration: 3000
            });
          }, 1000);
        }
      });
    }
  });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Calibration buttons
  const startCalibrationButton = document.getElementById('start-calibration');
  const skipCalibrationButton = document.getElementById('skip-calibration');
  
  if (startCalibrationButton) {
    startCalibrationButton.addEventListener('click', () => {
      eyeTracking.startCalibration();
      
      // Initialize HUD elements
      hudElements.init();
      
      // Set initialized state
      HUD.state.isInitialized = true;
    });
  }
  
  if (skipCalibrationButton) {
    skipCalibrationButton.addEventListener('click', () => {
      eyeTracking.skipCalibration();
      
      // Initialize HUD elements
      hudElements.init();
      
      // Set initialized state
      HUD.state.isInitialized = true;
    });
  }
  
  // Keyboard controls (for testing)
  document.addEventListener('keydown', (event) => {
    // Toggle gaze dot visibility with 'G' key
    if (event.key === 'g' || event.key === 'G') {
      if (HUD.elements.gazeDot) {
        HUD.elements.gazeDot.style.display = 
          HUD.elements.gazeDot.style.display === 'none' ? 'block' : 'none';
      }
    }
    
    // Create test notification with 'N' key
    if (event.key === 'n' || event.key === 'N') {
      createNotification('TEST NOTIFICATION', 'This is a test notification created by keyboard shortcut.', 3);
    }
    
    // Show test target with 'T' key
    if (event.key === 't' || event.key === 'T') {
      const testTarget = {
        type: 'AIRCRAFT',
        status: 'ACTIVE',
        threat: 'LOW',
        distance: '1250'
      };
      
      const testPosition = {
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 100,
        width: 200,
        height: 200
      };
      
      hudElements.showTargetIdentification(testTarget, testPosition);
      
      // Hide after 5 seconds
      setTimeout(() => {
        hudElements.hideTargetIdentification();
      }, 5000);
    }
  });
  
  // Mouse movement (for testing without eye tracking)
  document.addEventListener('mousemove', (event) => {
    if (!eyeTracking.isTracking && HUD.elements.gazeDot) {
      // Update gaze dot position
      HUD.elements.gazeDot.style.left = event.clientX + 'px';
      HUD.elements.gazeDot.style.top = event.clientY + 'px';
      
      // Update HUD state
      HUD.state.gazePosition = { x: event.clientX, y: event.clientY };
      
      // Update camera
      const offsetX = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const offsetY = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      
      HUD.three.camera.rotation.y = -offsetX * 0.05;
      HUD.three.camera.rotation.x = offsetY * 0.05;
    }
  });
  
  // Window resize
  window.addEventListener('resize', () => {
    // Update Three.js camera and renderer
    if (HUD.three.camera && HUD.three.renderer) {
      HUD.three.camera.aspect = window.innerWidth / window.innerHeight;
      HUD.three.camera.updateProjectionMatrix();
      HUD.three.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  });
}
