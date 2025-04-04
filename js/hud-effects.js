/**
 * Special effects for Iron Man HUD Interface
 */

class HUDEffects {
  constructor() {
    this.effects = {};
    this.initialized = false;
  }

  /**
   * Initialize HUD effects
   */
  init() {
    // Create effects
    this.createEffects();
    
    this.initialized = true;
  }

  /**
   * Create effects
   */
  createEffects() {
    // Create notification effect
    this.effects.notification = {
      active: false,
      duration: 0,
      callback: null,
      play: this.playNotificationEffect.bind(this)
    };
    
    // Create target lock effect
    this.effects.targetLock = {
      active: false,
      duration: 0,
      callback: null,
      play: this.playTargetLockEffect.bind(this)
    };
    
    // Create system alert effect
    this.effects.systemAlert = {
      active: false,
      duration: 0,
      callback: null,
      play: this.playSystemAlertEffect.bind(this)
    };
    
    // Create scan effect
    this.effects.scan = {
      active: false,
      duration: 0,
      callback: null,
      play: this.playScanEffect.bind(this)
    };
  }

  /**
   * Play notification effect
   * @param {Object} options - Effect options
   * @param {Function} callback - Callback after effect
   */
  playNotificationEffect(options = {}, callback) {
    if (this.effects.notification.active) return;
    
    // Set effect as active
    this.effects.notification.active = true;
    this.effects.notification.duration = options.duration || 2000;
    this.effects.notification.callback = callback;
    
    // Create audio element
    const audio = new Audio();
    audio.src = options.sound || 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAA8DcWTzYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
    audio.volume = options.volume || 0.5;
    
    // Play sound
    audio.play();
    
    // Create visual effect
    const container = document.createElement('div');
    container.className = 'hud-effect notification-effect';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0, 162, 255, 0.1)';
    container.style.boxShadow = 'inset 0 0 50px rgba(0, 255, 255, 0.3)';
    container.style.zIndex = '50';
    container.style.pointerEvents = 'none';
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.3s ease';
    
    // Add to DOM
    document.body.appendChild(container);
    
    // Animate in
    setTimeout(() => {
      container.style.opacity = '1';
    }, 10);
    
    // Animate out
    setTimeout(() => {
      container.style.opacity = '0';
      
      setTimeout(() => {
        // Remove from DOM
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
        
        // Set effect as inactive
        this.effects.notification.active = false;
        
        // Call callback
        if (this.effects.notification.callback) {
          this.effects.notification.callback();
        }
      }, 300);
    }, this.effects.notification.duration);
  }

  /**
   * Play target lock effect
   * @param {Object} options - Effect options
   * @param {Function} callback - Callback after effect
   */
  playTargetLockEffect(options = {}, callback) {
    if (this.effects.targetLock.active) return;
    
    // Set effect as active
    this.effects.targetLock.active = true;
    this.effects.targetLock.duration = options.duration || 1500;
    this.effects.targetLock.callback = callback;
    
    // Create audio element
    const audio = new Audio();
    audio.src = options.sound || 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAA8DcWTzYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
    audio.volume = options.volume || 0.5;
    
    // Play sound
    audio.play();
    
    // Get target position
    const x = options.x || window.innerWidth / 2;
    const y = options.y || window.innerHeight / 2;
    
    // Create visual effect
    const container = document.createElement('div');
    container.className = 'hud-effect target-lock-effect';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '50';
    container.style.pointerEvents = 'none';
    
    // Create target circle
    const circle = document.createElement('div');
    circle.style.position = 'absolute';
    circle.style.top = y + 'px';
    circle.style.left = x + 'px';
    circle.style.width = '100px';
    circle.style.height = '100px';
    circle.style.borderRadius = '50%';
    circle.style.border = '2px solid ' + HUD.config.colors.secondary;
    circle.style.boxShadow = '0 0 10px ' + HUD.config.colors.glow;
    circle.style.transform = 'translate(-50%, -50%) scale(0.5)';
    circle.style.opacity = '0';
    circle.style.transition = 'all 0.5s ease';
    
    // Create target lines
    const lines = document.createElement('div');
    lines.style.position = 'absolute';
    lines.style.top = y + 'px';
    lines.style.left = x + 'px';
    lines.style.width = '150px';
    lines.style.height = '150px';
    lines.style.transform = 'translate(-50%, -50%)';
    
    // Create horizontal line
    const horizontalLine = document.createElement('div');
    horizontalLine.style.position = 'absolute';
    horizontalLine.style.top = '50%';
    horizontalLine.style.left = '0';
    horizontalLine.style.width = '100%';
    horizontalLine.style.height = '1px';
    horizontalLine.style.backgroundColor = HUD.config.colors.secondary;
    horizontalLine.style.boxShadow = '0 0 5px ' + HUD.config.colors.glow;
    horizontalLine.style.transform = 'scaleX(0)';
    horizontalLine.style.transition = 'transform 0.5s ease';
    
    // Create vertical line
    const verticalLine = document.createElement('div');
    verticalLine.style.position = 'absolute';
    verticalLine.style.top = '0';
    verticalLine.style.left = '50%';
    verticalLine.style.width = '1px';
    verticalLine.style.height = '100%';
    verticalLine.style.backgroundColor = HUD.config.colors.secondary;
    verticalLine.style.boxShadow = '0 0 5px ' + HUD.config.colors.glow;
    verticalLine.style.transform = 'scaleY(0)';
    verticalLine.style.transition = 'transform 0.5s ease';
    
    // Assemble effect
    lines.appendChild(horizontalLine);
    lines.appendChild(verticalLine);
    container.appendChild(circle);
    container.appendChild(lines);
    
    // Add to DOM
    document.body.appendChild(container);
    
    // Animate in
    setTimeout(() => {
      circle.style.opacity = '1';
      circle.style.transform = 'translate(-50%, -50%) scale(1)';
      horizontalLine.style.transform = 'scaleX(1)';
      verticalLine.style.transform = 'scaleY(1)';
    }, 10);
    
    // Animate out
    setTimeout(() => {
      circle.style.opacity = '0';
      circle.style.transform = 'translate(-50%, -50%) scale(1.5)';
      horizontalLine.style.transform = 'scaleX(0)';
      verticalLine.style.transform = 'scaleY(0)';
      
      setTimeout(() => {
        // Remove from DOM
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
        
        // Set effect as inactive
        this.effects.targetLock.active = false;
        
        // Call callback
        if (this.effects.targetLock.callback) {
          this.effects.targetLock.callback();
        }
      }, 500);
    }, this.effects.targetLock.duration);
  }

  /**
   * Play system alert effect
   * @param {Object} options - Effect options
   * @param {Function} callback - Callback after effect
   */
  playSystemAlertEffect(options = {}, callback) {
    if (this.effects.systemAlert.active) return;
    
    // Set effect as active
    this.effects.systemAlert.active = true;
    this.effects.systemAlert.duration = options.duration || 2000;
    this.effects.systemAlert.callback = callback;
    
    // Create audio element
    const audio = new Audio();
    audio.src = options.sound || 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAA8DcWTzYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
    audio.volume = options.volume || 0.5;
    
    // Play sound
    audio.play();
    
    // Create visual effect
    const container = document.createElement('div');
    container.className = 'hud-effect system-alert-effect';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    container.style.boxShadow = 'inset 0 0 100px rgba(255, 0, 0, 0.2)';
    container.style.zIndex = '50';
    container.style.pointerEvents = 'none';
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.3s ease';
    
    // Create alert text
    const alertText = document.createElement('div');
    alertText.style.position = 'absolute';
    alertText.style.top = '50%';
    alertText.style.left = '50%';
    alertText.style.transform = 'translate(-50%, -50%)';
    alertText.style.color = '#ff3030';
    alertText.style.fontSize = '36px';
    alertText.style.fontWeight = 'bold';
    alertText.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.5)';
    alertText.style.textAlign = 'center';
    alertText.style.opacity = '0';
    alertText.style.transition = 'opacity 0.3s ease';
    alertText.textContent = options.text || 'SYSTEM ALERT';
    
    // Add to DOM
    container.appendChild(alertText);
    document.body.appendChild(container);
    
    // Animate in
    setTimeout(() => {
      container.style.opacity = '1';
      alertText.style.opacity = '1';
    }, 10);
    
    // Flash effect
    let flashCount = 0;
    const flashInterval = setInterval(() => {
      container.style.opacity = flashCount % 2 === 0 ? '0.5' : '1';
      flashCount++;
      
      if (flashCount >= 6) {
        clearInterval(flashInterval);
      }
    }, 200);
    
    // Animate out
    setTimeout(() => {
      container.style.opacity = '0';
      alertText.style.opacity = '0';
      
      setTimeout(() => {
        // Remove from DOM
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
        
        // Set effect as inactive
        this.effects.systemAlert.active = false;
        
        // Call callback
        if (this.effects.systemAlert.callback) {
          this.effects.systemAlert.callback();
        }
      }, 300);
    }, this.effects.systemAlert.duration);
  }

  /**
   * Play scan effect
   * @param {Object} options - Effect options
   * @param {Function} callback - Callback after effect
   */
  playScanEffect(options = {}, callback) {
    if (this.effects.scan.active) return;
    
    // Set effect as active
    this.effects.scan.active = true;
    this.effects.scan.duration = options.duration || 2000;
    this.effects.scan.callback = callback;
    
    // Create audio element
    const audio = new Audio();
    audio.src = options.sound || 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADwAD///////////////////////////////////////////8AAAA8TEFNRTMuMTAwAc0AAAAAAAAAABSAJAJAQgAAgAAAA8DcWTzYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
    audio.volume = options.volume || 0.5;
    
    // Play sound
    audio.play();
    
    // Create visual effect
    const container = document.createElement('div');
    container.className = 'hud-effect scan-effect';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '50';
    container.style.pointerEvents = 'none';
    container.style.overflow = 'hidden';
    
    // Create scan line
    const scanLine = document.createElement('div');
    scanLine.style.position = 'absolute';
    scanLine.style.top = '0';
    scanLine.style.left = '0';
    scanLine.style.width = '100%';
    scanLine.style.height = '2px';
    scanLine.style.backgroundColor = HUD.config.colors.secondary;
    scanLine.style.boxShadow = '0 0 10px ' + HUD.config.colors.glow;
    scanLine.style.transform = 'translateY(-100%)';
    scanLine.style.transition = 'transform ' + (this.effects.scan.duration / 1000) + 's linear';
    
    // Create scan overlay
    const scanOverlay = document.createElement('div');
    scanOverlay.style.position = 'absolute';
    scanOverlay.style.top = '0';
    scanOverlay.style.left = '0';
    scanOverlay.style.width = '100%';
    scanOverlay.style.height = '100%';
    scanOverlay.style.background = 'linear-gradient(to bottom, rgba(0, 162, 255, 0.1) 0%, rgba(0, 162, 255, 0) 100%)';
    scanOverlay.style.transform = 'translateY(-100%)';
    scanOverlay.style.transition = 'transform ' + (this.effects.scan.duration / 1000) + 's linear';
    
    // Add to DOM
    container.appendChild(scanOverlay);
    container.appendChild(scanLine);
    document.body.appendChild(container);
    
    // Animate scan
    setTimeout(() => {
      scanLine.style.transform = 'translateY(' + window.innerHeight + 'px)';
      scanOverlay.style.transform = 'translateY(0)';
    }, 10);
    
    // Animate out
    setTimeout(() => {
      // Remove from DOM
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
      
      // Set effect as inactive
      this.effects.scan.active = false;
      
      // Call callback
      if (this.effects.scan.callback) {
        this.effects.scan.callback();
      }
    }, this.effects.scan.duration);
  }
}
