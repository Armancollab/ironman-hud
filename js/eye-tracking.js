/**
 * Eye Tracking functionality for Iron Man HUD Interface
 */

class EyeTracking {
  constructor() {
    this.isInitialized = false;
    this.isCalibrated = false;
    this.isTracking = false;
    this.gazeData = { x: 0, y: 0 };
    this.lastGazeData = { x: 0, y: 0 };
    this.smoothedGazeData = { x: 0, y: 0 };
    this.gazeHistory = [];
    this.calibrationPoints = [];
    this.currentCalibrationPoint = 0;
    this.stareStartTime = 0;
    this.stareElement = null;
    this.gazeThreshold = 50; // pixels
    this.stareThreshold = 1.5; // seconds
    this.smoothingFactor = 0.3; // lower = smoother
    this.gazeDot = null;
  }

  /**
   * Initialize eye tracking
   */
  async init() {
    try {
      this.gazeDot = document.getElementById('gaze-dot');
      
      // Initialize WebGazer
      await webgazer.setGazeListener((data, timestamp) => {
        if (data == null || !this.isTracking) return;
        
        // Update gaze data
        this.lastGazeData = { ...this.gazeData };
        this.gazeData = { x: data.x, y: data.y };
        
        // Apply smoothing
        this.smoothedGazeData.x = lerp(this.smoothedGazeData.x, this.gazeData.x, this.smoothingFactor);
        this.smoothedGazeData.y = lerp(this.smoothedGazeData.y, this.gazeData.y, this.smoothingFactor);
        
        // Update gaze history (for analysis)
        this.gazeHistory.push({
          x: this.smoothedGazeData.x,
          y: this.smoothedGazeData.y,
          timestamp: timestamp
        });
        
        // Limit history size
        if (this.gazeHistory.length > 100) {
          this.gazeHistory.shift();
        }
        
        // Update HUD state
        HUD.state.gazePosition = { ...this.smoothedGazeData };
        
        // Update gaze dot position
        this.updateGazeDot();
        
        // Check for staring at elements
        this.checkStaring();
        
        // Update camera based on gaze
        this.updateCameraFromGaze();
      }).begin();
      
      // Set up video feed
      webgazer.showVideoPreview(true)
        .showPredictionPoints(false)
        .applyKalmanFilter(true);
      
      // Move video feed to container
      const videoContainer = document.getElementById('webgazer-video-container');
      const videoElement = document.getElementById('webgazerVideoFeed');
      if (videoElement && videoContainer) {
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        videoElement.style.margin = '0';
        videoContainer.appendChild(videoElement);
      }
      
      this.isInitialized = true;
      createNotification('EYE TRACKING', 'Eye tracking system initialized. Calibration required for optimal performance.');
      
      return true;
    } catch (error) {
      console.error('Error initializing eye tracking:', error);
      createNotification('SYSTEM ERROR', 'Failed to initialize eye tracking. Using fallback mode.', 5);
      return false;
    }
  }

  /**
   * Start calibration process
   */
  startCalibration() {
    if (!this.isInitialized) return false;
    
    // Show calibration screen
    const calibrationScreen = document.getElementById('calibration-screen');
    showElement(calibrationScreen);
    
    // Generate calibration points
    this.generateCalibrationPoints();
    
    // Start calibration
    this.isCalibrated = false;
    this.currentCalibrationPoint = 0;
    
    // Play calibration start effect
    if (hudEffects) {
      hudEffects.effects.notification.play({
        duration: 1000,
        sound: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAA8DcWTzYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='
      }, () => {
        // Show first point after effect
        this.showCalibrationPoint(0);
      });
    } else {
      // Show first point immediately
      this.showCalibrationPoint(0);
    }
    
    return true;
  }

  /**
   * Generate calibration points
   */
  generateCalibrationPoints() {
    const container = document.getElementById('calibration-points');
    container.innerHTML = '';
    this.calibrationPoints = [];
    
    // Create 9 calibration points in a 3x3 grid
    const numPoints = 9;
    const numCols = 3;
    const numRows = 3;
    
    for (let i = 0; i < numPoints; i++) {
      const point = document.createElement('div');
      point.className = 'calibration-point';
      point.style.position = 'absolute';
      point.style.width = '20px';
      point.style.height = '20px';
      point.style.borderRadius = '50%';
      point.style.backgroundColor = HUD.config.colors.primary;
      point.style.boxShadow = '0 0 10px ' + HUD.config.colors.glow;
      point.style.transform = 'translate(-50%, -50%)';
      point.style.display = 'none';
      
      // Calculate position in grid
      const col = i % numCols;
      const row = Math.floor(i / numCols);
      
      // Calculate percentage position
      const x = 10 + (col * 40); // 10%, 50%, 90%
      const y = 10 + (row * 40); // 10%, 50%, 90%
      
      point.style.left = x + '%';
      point.style.top = y + '%';
      
      // Store point data
      this.calibrationPoints.push({
        element: point,
        x: x,
        y: y
      });
      
      container.appendChild(point);
    }
  }

  /**
   * Show calibration point
   * @param {number} index - Point index
   */
  showCalibrationPoint(index) {
    if (index >= this.calibrationPoints.length) {
      this.completeCalibration();
      return;
    }
    
    // Hide all points
    this.calibrationPoints.forEach(point => {
      point.element.style.display = 'none';
    });
    
    // Show current point
    const point = this.calibrationPoints[index];
    point.element.style.display = 'block';
    
    // Animate point
    point.element.style.animation = 'pulse 1s infinite';
    
    // Set current point
    this.currentCalibrationPoint = index;
    
    // Play sound effect for each point
    if (hudEffects) {
      hudEffects.effects.targetLock.play({
        duration: 500,
        x: point.element.offsetLeft,
        y: point.element.offsetTop,
        volume: 0.3
      });
    }
    
    // Auto-advance after 2 seconds
    setTimeout(() => {
      this.showCalibrationPoint(index + 1);
    }, 2000);
  }

  /**
   * Complete calibration
   */
  completeCalibration() {
    this.isCalibrated = true;
    
    // Play completion effect
    if (hudEffects) {
      hudEffects.effects.systemAlert.play({
        duration: 1500,
        text: 'CALIBRATION COMPLETE',
        sound: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAA8DcWTzYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='
      }, () => {
        // Voice feedback if available
        if (hudVoice && hudVoice.initialized) {
          hudVoice.speak('Eye tracking calibration complete. HUD interface activated.', () => {
            this.finishCalibration();
          });
        } else {
          this.finishCalibration();
        }
      });
    } else {
      if (hudVoice && hudVoice.initialized) {
        hudVoice.speak('Eye tracking calibration complete. HUD interface activated.', () => {
          this.finishCalibration();
        });
      } else {
        this.finishCalibration();
      }
    }
  }
  
  /**
   * Finish calibration process and show HUD
   */
  finishCalibration() {
    // Hide calibration screen
    const calibrationScreen = document.getElementById('calibration-screen');
    hideElement(calibrationScreen, () => {
      // Show HUD interface
      const hudInterface = document.getElementById('hud-interface');
      showElement(hudInterface);
      
      // Start tracking
      this.startTracking();
      
      // Show gaze dot
      if (this.gazeDot) {
        this.gazeDot.style.display = 'block';
      }
      
      // Create notification
      createNotification('CALIBRATION COMPLETE', 'Eye tracking calibration completed successfully. HUD interface activated.', 5);
      
      // Play scan effect after a delay
      setTimeout(() => {
        if (hudEffects) {
          hudEffects.effects.scan.play({
            duration: 3000
          });
        }
      }, 1000);
    });
  }

  /**
   * Skip calibration
   */
  skipCalibration() {
    // Play skip effect
    if (hudEffects) {
      hudEffects.effects.notification.play({
        duration: 1000,
        sound: 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAA8DcWTzYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU='
      }, () => {
        // Hide calibration screen
        const calibrationScreen = document.getElementById('calibration-screen');
        hideElement(calibrationScreen, () => {
          // Show HUD interface
          const hudInterface = document.getElementById('hud-interface');
          showElement(hudInterface);
          
          // Start tracking with default values
          this.isCalibrated = false;
          this.startTracking();
          
          // Show gaze dot
          if (this.gazeDot) {
            this.gazeDot.style.display = 'block';
          }
          
          // Create notification
          createNotification('CALIBRATION SKIPPED', 'Using default eye tracking settings. Accuracy may be reduced.', 5);
          
          // Initialize HUD elements
          hudElements.init();
          
          // Set initialized state
          HUD.state.isInitialized = true;
          
          // Play scan effect after a delay
          setTimeout(() => {
            if (hudEffects) {
              hudEffects.effects.scan.play({
                duration: 3000
              });
            }
          }, 1000);
        });
      });
    } else {
      // Hide calibration screen
      const calibrationScreen = document.getElementById('calibration-screen');
      hideElement(calibrationScreen, () => {
        // Show HUD interface
        const hudInterface = document.getElementById('hud-interface');
        showElement(hudInterface);
        
        // Start tracking with default values
        this.isCalibrated = false;
        this.startTracking();
        
        // Show gaze dot
        if (this.gazeDot) {
          this.gazeDot.style.display = 'block';
        }
        
        // Create notification
        createNotification('CALIBRATION SKIPPED', 'Using default eye tracking settings. Accuracy may be reduced.', 5);
        
        // Initialize HUD elements
        hudElements.init();
        
        // Set initialized state
        HUD.state.isInitialized = true;
      });
    }
  }

  /**
   * Start eye tracking
   */
  startTracking() {
    if (!this.isInitialized) return false;
    
    this.isTracking = true;
    return true;
  }

  /**
   * Stop eye tracking
   */
  stopTracking() {
    this.isTracking = false;
    
    // Hide gaze dot
    if (this.gazeDot) {
      this.gazeDot.style.display = 'none';
    }
  }

  /**
   * Update gaze dot position
   */
  updateGazeDot() {
    if (!this.gazeDot || !this.isTracking) return;
    
    // Update position
    this.gazeDot.style.left = this.smoothedGazeData.x + 'px';
    this.gazeDot.style.top = this.smoothedGazeData.y + 'px';
  }

  /**
   * Check if user is staring at an activatable element
   */
  checkStaring() {
    if (!this.isTracking) return;
    
    // Get all activatable elements
    const activatableElements = document.querySelectorAll('[data-activatable="true"]');
    let foundElement = null;
    
    // Check each element
    activatableElements.forEach(element => {
      if (isGazeOnElement(this.smoothedGazeData, element)) {
        foundElement = element;
      }
    });
    
    // Handle staring logic
    if (foundElement) {
      // If looking at a new element
      if (this.stareElement !== foundElement) {
        this.stareElement = foundElement;
        this.stareStartTime = Date.now();
        
        // Highlight element
        foundElement.style.boxShadow = '0 0 20px ' + HUD.config.colors.secondary;
        
        // Play subtle focus sound
        if (hudEffects) {
          hudEffects.effects.notification.play({
            duration: 300,
            volume: 0.2
          });
        }
        
        // Show focus indicator on canvas if available
        if (hudCanvas && hudCanvas.elements.targetLock) {
          const rect = foundElement.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          hudCanvas.setTargetLock(true, x, y);
        }
      } else {
        // Continue staring at same element
        const stareTime = (Date.now() - this.stareStartTime) / 1000;
        
        // Update progress in canvas target lock
        if (hudCanvas && hudCanvas.elements.targetLock && hudCanvas.elements.targetLock.active) {
          hudCanvas.elements.targetLock.progress = stareTime / this.stareThreshold;
        }
        
        // Check if stare threshold reached
        if (stareTime >= this.stareThreshold) {
          // Activate element
          const elementName = foundElement.getAttribute('data-name');
          
          // Play activation effect
          if (hudEffects) {
            hudEffects.effects.targetLock.play({
              duration: 1000,
              x: this.smoothedGazeData.x,
              y: this.smoothedGazeData.y
            }, () => {
              // Activate the element after effect
              hudElements.activateElement(elementName);
            });
          } else {
            // Activate immediately if no effects
            hudElements.activateElement(elementName);
          }
          
          // Reset stare
          this.stareStartTime = Date.now() + 2000; // Prevent immediate reactivation
          
          // Reset canvas target lock
          if (hudCanvas && hudCanvas.elements.targetLock) {
            hudCanvas.setTargetLock(false, 0, 0);
          }
        }
      }
    } else {
      // Not staring at any element
      if (this.stareElement) {
        // Reset highlight
        this.stareElement.style.boxShadow = '';
        this.stareElement = null;
        
        // Reset canvas target lock
        if (hudCanvas && hudCanvas.elements.targetLock) {
          hudCanvas.setTargetLock(false, 0, 0);
        }
      }
    }
  }

  /**
   * Update camera based on gaze position
   */
  updateCameraFromGaze() {
    if (!this.isTracking || !HUD.three.camera) return;
    
    // Get viewport center
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Calculate offset from center (normalized -1 to 1)
    const offsetX = (this.smoothedGazeData.x - centerX) / centerX;
    const offsetY = (this.smoothedGazeData.y - centerY) / centerY;
    
    // Apply rotation to camera
    const rotationFactor = HUD.config.eyeTracking.cameraRotationFactor;
    HUD.three.camera.rotation.y = -offsetX * rotationFactor;
    HUD.three.camera.rotation.x = offsetY * rotationFactor;
    
    // Update HUD canvas target lock if staring at a point
    if (hudCanvas && this.stareElement === null) {
      const gazeVelocity = this.getGazeVelocity();
      
      // If gaze is relatively still and not already staring at a DOM element
      if (gazeVelocity < 50) {
        // Check if we've been looking at the same area for a while
        if (calculateDistance(this.smoothedGazeData, this.lastGazeData) < 30) {
          if (!hudCanvas.elements.targetLock.active) {
            hudCanvas.setTargetLock(true, this.smoothedGazeData.x, this.smoothedGazeData.y);
          }
        }
      } else if (hudCanvas.elements.targetLock.active) {
        hudCanvas.setTargetLock(false, 0, 0);
      }
    }
  }

  /**
   * Get gaze velocity
   * @returns {number} Velocity in pixels per second
   */
  getGazeVelocity() {
    if (this.gazeHistory.length < 2) return 0;
    
    // Get last two points
    const last = this.gazeHistory[this.gazeHistory.length - 1];
    const prev = this.gazeHistory[this.gazeHistory.length - 2];
    
    // Calculate distance
    const distance = calculateDistance(
      { x: prev.x, y: prev.y },
      { x: last.x, y: last.y }
    );
    
    // Calculate time difference
    const timeDiff = (last.timestamp - prev.timestamp) / 1000; // in seconds
    
    // Calculate velocity
    return distance / timeDiff;
  }

  /**
   * Get gaze direction
   * @returns {string} Direction (up, down, left, right, center)
   */
  getGazeDirection() {
    // Get viewport center
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Calculate offset from center
    const offsetX = this.smoothedGazeData.x - centerX;
    const offsetY = this.smoothedGazeData.y - centerY;
    
    // Calculate absolute offset
    const absOffsetX = Math.abs(offsetX);
    const absOffsetY = Math.abs(offsetY);
    
    // Determine direction
    if (absOffsetX < 100 && absOffsetY < 100) {
      return 'center';
    } else if (absOffsetX > absOffsetY) {
      return offsetX > 0 ? 'right' : 'left';
    } else {
      return offsetY > 0 ? 'down' : 'up';
    }
  }
}
