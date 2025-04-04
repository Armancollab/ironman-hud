/**
 * Performance optimizer for Iron Man HUD Interface
 */

class PerformanceOptimizer {
  constructor() {
    this.fps = 0;
    this.frameTime = 0;
    this.frameCount = 0;
    this.lastTime = 0;
    this.fpsUpdateInterval = 1000; // Update FPS every second
    this.lastFpsUpdate = 0;
    
    this.isMonitoring = false;
    this.optimizationLevel = 0; // 0: none, 1: low, 2: medium, 3: high
    
    this.thresholds = {
      fps: {
        good: 50,
        medium: 30,
        low: 20
      },
      frameTime: {
        good: 16, // ~60fps
        medium: 33, // ~30fps
        high: 50 // ~20fps
      }
    };
    
    this.optimizations = {
      particleCount: [1000, 500, 200, 100],
      shadowsEnabled: [true, true, false, false],
      effectsQuality: [1.0, 0.8, 0.6, 0.4],
      renderScale: [1.0, 0.9, 0.8, 0.7],
      maxLights: [5, 4, 3, 2],
      postProcessing: [true, true, false, false]
    };
    
    this.stats = {
      fps: [],
      frameTime: [],
      memory: []
    };
    
    this.statsMaxLength = 60; // Keep last 60 readings (about 1 minute)
    this.initialized = false;
  }

  /**
   * Initialize performance optimizer
   */
  init() {
    // Create FPS counter
    this.createFpsCounter();
    
    // Start monitoring
    this.startMonitoring();
    
    // Set initial optimization level
    this.setOptimizationLevel(1); // Start with low optimization
    
    this.initialized = true;
    return true;
  }

  /**
   * Create FPS counter
   */
  createFpsCounter() {
    // Create FPS counter element
    const fpsCounter = document.createElement('div');
    fpsCounter.id = 'fps-counter';
    fpsCounter.style.position = 'fixed';
    fpsCounter.style.bottom = '10px';
    fpsCounter.style.right = '10px';
    fpsCounter.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    fpsCounter.style.color = '#0af';
    fpsCounter.style.padding = '5px 10px';
    fpsCounter.style.borderRadius = '3px';
    fpsCounter.style.fontFamily = 'monospace';
    fpsCounter.style.fontSize = '12px';
    fpsCounter.style.zIndex = '9999';
    fpsCounter.style.display = 'none'; // Hidden by default
    
    // Add to DOM
    document.body.appendChild(fpsCounter);
    
    // Store reference
    this.fpsCounter = fpsCounter;
  }

  /**
   * Start performance monitoring
   */
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.lastFpsUpdate = this.lastTime;
    
    // Start animation frame loop
    this.monitorPerformance();
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring() {
    this.isMonitoring = false;
  }

  /**
   * Monitor performance
   */
  monitorPerformance() {
    if (!this.isMonitoring) return;
    
    const now = performance.now();
    const elapsed = now - this.lastTime;
    
    // Calculate frame time
    this.frameTime = elapsed;
    
    // Add to stats
    this.addStat('frameTime', this.frameTime);
    
    // Update FPS counter
    this.frameCount++;
    if (now - this.lastFpsUpdate >= this.fpsUpdateInterval) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.lastFpsUpdate = now;
      this.frameCount = 0;
      
      // Add to stats
      this.addStat('fps', this.fps);
      
      // Update FPS counter
      if (this.fpsCounter) {
        this.fpsCounter.textContent = `FPS: ${this.fps} | Frame: ${Math.round(this.frameTime)}ms`;
      }
      
      // Check if optimization is needed
      this.checkOptimization();
      
      // Get memory info if available
      if (window.performance && window.performance.memory) {
        const memory = window.performance.memory.usedJSHeapSize / 1048576; // Convert to MB
        this.addStat('memory', memory);
      }
    }
    
    this.lastTime = now;
    
    // Continue monitoring
    requestAnimationFrame(this.monitorPerformance.bind(this));
  }

  /**
   * Add stat to history
   * @param {string} type - Stat type
   * @param {number} value - Stat value
   */
  addStat(type, value) {
    if (!this.stats[type]) return;
    
    this.stats[type].push(value);
    
    // Limit array length
    if (this.stats[type].length > this.statsMaxLength) {
      this.stats[type].shift();
    }
  }

  /**
   * Get average stat
   * @param {string} type - Stat type
   * @param {number} samples - Number of samples to average
   * @returns {number} Average value
   */
  getAverageStat(type, samples = 10) {
    if (!this.stats[type] || this.stats[type].length === 0) return 0;
    
    const count = Math.min(samples, this.stats[type].length);
    const values = this.stats[type].slice(-count);
    
    return values.reduce((sum, value) => sum + value, 0) / count;
  }

  /**
   * Check if optimization is needed
   */
  checkOptimization() {
    const avgFps = this.getAverageStat('fps', 5);
    const avgFrameTime = this.getAverageStat('frameTime', 5);
    
    // Determine if optimization level needs to change
    let newLevel = this.optimizationLevel;
    
    if (avgFps < this.thresholds.fps.low || avgFrameTime > this.thresholds.frameTime.high) {
      // Performance is poor, increase optimization
      newLevel = Math.min(3, this.optimizationLevel + 1);
    } else if (avgFps < this.thresholds.fps.medium || avgFrameTime > this.thresholds.frameTime.medium) {
      // Performance is medium, slight optimization
      newLevel = Math.min(2, this.optimizationLevel);
    } else if (avgFps > this.thresholds.fps.good && avgFrameTime < this.thresholds.frameTime.good && this.optimizationLevel > 0) {
      // Performance is good, decrease optimization if possible
      newLevel = Math.max(0, this.optimizationLevel - 1);
    }
    
    // Apply new optimization level if changed
    if (newLevel !== this.optimizationLevel) {
      this.setOptimizationLevel(newLevel);
    }
  }

  /**
   * Set optimization level
   * @param {number} level - Optimization level (0-3)
   */
  setOptimizationLevel(level) {
    level = Math.max(0, Math.min(3, level));
    
    if (level === this.optimizationLevel) return;
    
    this.optimizationLevel = level;
    
    // Apply optimizations
    this.applyOptimizations();
    
    console.log(`Performance optimization level set to ${level}`);
  }

  /**
   * Apply optimizations based on current level
   */
  applyOptimizations() {
    const level = this.optimizationLevel;
    
    // Apply Three.js optimizations
    if (HUD.three && HUD.three.scene) {
      // Adjust particle count
      if (HUD.three.particles) {
        const targetCount = this.optimizations.particleCount[level];
        this.adjustParticleCount(targetCount);
      }
      
      // Adjust shadows
      if (HUD.three.renderer) {
        HUD.three.renderer.shadowMap.enabled = this.optimizations.shadowsEnabled[level];
      }
      
      // Adjust render scale
      if (HUD.three.renderer) {
        const pixelRatio = window.devicePixelRatio * this.optimizations.renderScale[level];
        HUD.three.renderer.setPixelRatio(pixelRatio);
      }
    }
    
    // Apply HUD optimizations
    if (hudCanvas) {
      hudCanvas.setQuality(this.optimizations.effectsQuality[level]);
    }
    
    // Apply effects optimizations
    if (hudEffects) {
      // Reduce effects quality or disable some effects
    }
  }

  /**
   * Adjust particle count
   * @param {number} targetCount - Target particle count
   */
  adjustParticleCount(targetCount) {
    if (!HUD.three || !HUD.three.particles) return;
    
    const currentCount = HUD.three.particles.geometry.attributes.position.count;
    
    if (targetCount === currentCount) return;
    
    // Implement particle count adjustment
    // This would typically involve recreating the particle system
    // with the new count, which is specific to the implementation
  }

  /**
   * Toggle FPS counter visibility
   */
  toggleFpsCounter() {
    if (!this.fpsCounter) return;
    
    this.fpsCounter.style.display = this.fpsCounter.style.display === 'none' ? 'block' : 'none';
  }

  /**
   * Get optimization status
   * @returns {Object} Optimization status
   */
  getStatus() {
    return {
      fps: this.fps,
      frameTime: this.frameTime,
      optimizationLevel: this.optimizationLevel,
      isMonitoring: this.isMonitoring
    };
  }
}
