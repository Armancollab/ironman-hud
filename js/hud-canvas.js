/**
 * Canvas-based HUD elements for Iron Man Interface
 * This file enhances the DOM-based HUD elements with canvas-drawn elements
 * for better performance and visual effects
 */

class HUDCanvas {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.elements = {};
    this.initialized = false;
    this.lastFrameTime = 0;
  }

  /**
   * Initialize HUD canvas
   */
  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'hud-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '5';
    
    // Set canvas size
    this.resize();
    
    // Get context
    this.ctx = this.canvas.getContext('2d');
    
    // Add to DOM
    document.body.appendChild(this.canvas);
    
    // Create elements
    this.createElements();
    
    // Add resize listener
    window.addEventListener('resize', this.resize.bind(this));
    
    this.initialized = true;
    
    // Start animation loop
    this.animate();
  }

  /**
   * Resize canvas
   */
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  /**
   * Create HUD elements
   */
  createElements() {
    // Create crosshair
    this.elements.crosshair = {
      x: this.width / 2,
      y: this.height / 2,
      size: 20,
      color: HUD.config.colors.secondary,
      draw: this.drawCrosshair.bind(this)
    };
    
    // Create arc reactor visualization
    this.elements.arcReactor = {
      x: this.width / 2,
      y: this.height - 100,
      radius: 50,
      rotation: 0,
      segments: 8,
      power: HUD.state.systemStatus.arcReactorPower,
      draw: this.drawArcReactor.bind(this)
    };
    
    // Create radar sweep
    this.elements.radarSweep = {
      x: 120,
      y: 120,
      radius: 100,
      angle: 0,
      draw: this.drawRadarSweep.bind(this)
    };
    
    // Create data visualization
    this.elements.dataViz = {
      x: this.width - 150,
      y: this.height - 100,
      width: 200,
      height: 100,
      data: Array(20).fill(0).map(() => Math.random() * 100),
      draw: this.drawDataVisualization.bind(this)
    };
    
    // Create target lock
    this.elements.targetLock = {
      active: false,
      x: 0,
      y: 0,
      size: 80,
      progress: 0,
      draw: this.drawTargetLock.bind(this)
    };
    
    // Create HUD frame
    this.elements.hudFrame = {
      draw: this.drawHUDFrame.bind(this)
    };
    
    // Create scan lines
    this.elements.scanLines = {
      draw: this.drawScanLines.bind(this)
    };
  }

  /**
   * Animation loop
   */
  animate(timestamp) {
    requestAnimationFrame(this.animate.bind(this));
    
    if (!this.initialized) return;
    
    // Calculate delta time
    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Update and draw elements
    this.update(deltaTime / 1000);
    this.draw();
  }

  /**
   * Update elements
   * @param {number} deltaTime - Delta time in seconds
   */
  update(deltaTime) {
    // Update crosshair position based on gaze
    if (HUD.state.gazePosition.x && HUD.state.gazePosition.y) {
      this.elements.crosshair.x = HUD.state.gazePosition.x;
      this.elements.crosshair.y = HUD.state.gazePosition.y;
    }
    
    // Update arc reactor
    this.elements.arcReactor.power = HUD.state.systemStatus.arcReactorPower;
    this.elements.arcReactor.rotation += deltaTime * 0.5;
    
    // Update radar sweep
    this.elements.radarSweep.angle += deltaTime * 1.5;
    if (this.elements.radarSweep.angle > Math.PI * 2) {
      this.elements.radarSweep.angle -= Math.PI * 2;
    }
    
    // Update data visualization
    const newData = this.elements.dataViz.data.slice(1);
    newData.push(
      this.elements.dataViz.data[this.elements.dataViz.data.length - 1] + 
      (Math.random() * 10 - 5)
    );
    newData[newData.length - 1] = clamp(newData[newData.length - 1], 0, 100);
    this.elements.dataViz.data = newData;
    
    // Update target lock if active
    if (this.elements.targetLock.active) {
      this.elements.targetLock.progress += deltaTime * 0.5;
      if (this.elements.targetLock.progress >= 1) {
        this.elements.targetLock.progress = 1;
      }
    }
  }

  /**
   * Draw all elements
   */
  draw() {
    // Draw scan lines first (background effect)
    this.elements.scanLines.draw();
    
    // Draw HUD frame
    this.elements.hudFrame.draw();
    
    // Draw other elements
    this.elements.radarSweep.draw();
    this.elements.arcReactor.draw();
    this.elements.dataViz.draw();
    
    // Draw target lock if active
    if (this.elements.targetLock.active) {
      this.elements.targetLock.draw();
    }
    
    // Draw crosshair last (on top)
    this.elements.crosshair.draw();
  }

  /**
   * Draw crosshair
   */
  drawCrosshair() {
    const { x, y, size, color } = this.elements.crosshair;
    
    this.ctx.save();
    
    // Draw outer circle
    this.ctx.beginPath();
    this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // Draw inner circle
    this.ctx.beginPath();
    this.ctx.arc(x, y, size / 10, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    // Draw lines
    this.ctx.beginPath();
    // Horizontal
    this.ctx.moveTo(x - size / 2, y);
    this.ctx.lineTo(x - size / 6, y);
    this.ctx.moveTo(x + size / 6, y);
    this.ctx.lineTo(x + size / 2, y);
    // Vertical
    this.ctx.moveTo(x, y - size / 2);
    this.ctx.lineTo(x, y - size / 6);
    this.ctx.moveTo(x, y + size / 6);
    this.ctx.lineTo(x, y + size / 2);
    
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  /**
   * Draw arc reactor
   */
  drawArcReactor() {
    const { x, y, radius, rotation, segments, power } = this.elements.arcReactor;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Draw outer circle
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = HUD.config.colors.primary;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Draw inner circle
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius * 0.8, 0, Math.PI * 2);
    this.ctx.strokeStyle = HUD.config.colors.primary;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // Draw segments
    const segmentAngle = (Math.PI * 2) / segments;
    for (let i = 0; i < segments; i++) {
      const startAngle = rotation + i * segmentAngle;
      const endAngle = startAngle + segmentAngle * 0.8;
      
      // Calculate if segment should be lit based on power
      const segmentPower = (i / segments) * 100;
      const isLit = segmentPower <= power;
      
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius * 0.9, startAngle, endAngle);
      this.ctx.strokeStyle = isLit ? HUD.config.colors.secondary : HUD.config.colors.primary;
      this.ctx.lineWidth = isLit ? 3 : 1;
      this.ctx.stroke();
    }
    
    // Draw power text
    this.ctx.font = 'bold 16px Arial';
    this.ctx.fillStyle = HUD.config.colors.accent;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(Math.round(power) + '%', 0, 0);
    
    // Draw glow
    this.ctx.beginPath();
    const gradient = this.ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius);
    gradient.addColorStop(0, 'rgba(0, 162, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 162, 255, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  /**
   * Draw radar sweep
   */
  drawRadarSweep() {
    const { x, y, radius, angle } = this.elements.radarSweep;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Draw outer circle
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = HUD.config.colors.primary;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Draw grid
    this.ctx.beginPath();
    // Horizontal line
    this.ctx.moveTo(-radius, 0);
    this.ctx.lineTo(radius, 0);
    // Vertical line
    this.ctx.moveTo(0, -radius);
    this.ctx.lineTo(0, radius);
    this.ctx.strokeStyle = HUD.config.colors.primary;
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // Draw concentric circles
    for (let i = 1; i <= 2; i++) {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius * (i / 3), 0, Math.PI * 2);
      this.ctx.strokeStyle = HUD.config.colors.primary;
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
    
    // Draw sweep
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.arc(0, 0, radius, angle - 0.2, angle);
    this.ctx.closePath();
    
    const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 162, 255, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Draw blips
    const blips = [
      { distance: 0.4, angle: Math.PI * 0.3, size: 3, color: HUD.config.colors.secondary },
      { distance: 0.7, angle: Math.PI * 1.7, size: 3, color: HUD.config.colors.secondary },
      { distance: 0.5, angle: Math.PI * 0.8, size: 4, color: '#ff3030' }
    ];
    
    blips.forEach(blip => {
      const blipX = Math.cos(blip.angle) * radius * blip.distance;
      const blipY = Math.sin(blip.angle) * radius * blip.distance;
      
      this.ctx.beginPath();
      this.ctx.arc(blipX, blipY, blip.size, 0, Math.PI * 2);
      this.ctx.fillStyle = blip.color;
      this.ctx.fill();
      
      // Add glow
      this.ctx.beginPath();
      const blipGradient = this.ctx.createRadialGradient(
        blipX, blipY, 0,
        blipX, blipY, blip.size * 3
      );
      blipGradient.addColorStop(0, blip.color);
      blipGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = blipGradient;
      this.ctx.arc(blipX, blipY, blip.size * 3, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    this.ctx.restore();
  }

  /**
   * Draw data visualization
   */
  drawDataVisualization() {
    const { x, y, width, height, data } = this.elements.dataViz;
    
    this.ctx.save();
    
    // Draw background
    this.ctx.fillStyle = 'rgba(0, 10, 20, 0.5)';
    this.ctx.strokeStyle = HUD.config.colors.primary;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.rect(x - width / 2, y - height / 2, width, height);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Draw title
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = HUD.config.colors.primary;
    this.ctx.textAlign = 'center';
    this.ctx.fillText('SYSTEM PERFORMANCE', x, y - height / 2 + 15);
    
    // Draw line graph
    this.ctx.beginPath();
    const step = width / (data.length - 1);
    
    for (let i = 0; i < data.length; i++) {
      const dataX = x - width / 2 + i * step;
      const dataY = y + height / 2 - (data[i] / 100) * height;
      
      if (i === 0) {
        this.ctx.moveTo(dataX, dataY);
      } else {
        this.ctx.lineTo(dataX, dataY);
      }
    }
    
    this.ctx.strokeStyle = HUD.config.colors.secondary;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Draw fill
    this.ctx.lineTo(x + width / 2, y + height / 2);
    this.ctx.lineTo(x - width / 2, y + height / 2);
    this.ctx.closePath();
    
    const gradient = this.ctx.createLinearGradient(x, y - height / 2, x, y + height / 2);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 162, 255, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    this.ctx.restore();
  }

  /**
   * Draw target lock
   */
  drawTargetLock() {
    const { x, y, size, progress } = this.elements.targetLock;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    
    // Draw corners
    const cornerSize = size * 0.3;
    const cornerOffset = size / 2;
    
    this.ctx.strokeStyle = HUD.config.colors.secondary;
    this.ctx.lineWidth = 2;
    
    // Top-left corner
    this.ctx.beginPath();
    this.ctx.moveTo(-cornerOffset, -cornerOffset + cornerSize);
    this.ctx.lineTo(-cornerOffset, -cornerOffset);
    this.ctx.lineTo(-cornerOffset + cornerSize, -cornerOffset);
    this.ctx.stroke();
    
    // Top-right corner
    this.ctx.beginPath();
    this.ctx.moveTo(cornerOffset - cornerSize, -cornerOffset);
    this.ctx.lineTo(cornerOffset, -cornerOffset);
    this.ctx.lineTo(cornerOffset, -cornerOffset + cornerSize);
    this.ctx.stroke();
    
    // Bottom-left corner
    this.ctx.beginPath();
    this.ctx.moveTo(-cornerOffset, cornerOffset - cornerSize);
    this.ctx.lineTo(-cornerOffset, cornerOffset);
    this.ctx.lineTo(-cornerOffset + cornerSize, cornerOffset);
    this.ctx.stroke();
    
    // Bottom-right corner
    this.ctx.beginPath();
    this.ctx.moveTo(cornerOffset - cornerSize, cornerOffset);
    this.ctx.lineTo(cornerOffset, cornerOffset);
    this.ctx.lineTo(cornerOffset, cornerOffset - cornerSize);
    this.ctx.stroke();
    
    // Draw progress circle
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2 * progress);
    this.ctx.strokeStyle = HUD.config.colors.secondary;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    // Draw text
    if (progress >= 1) {
      this.ctx.font = 'bold 14px Arial';
      this.ctx.fillStyle = HUD.config.colors.secondary;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('TARGET LOCKED', 0, 0);
    }
    
    this.ctx.restore();
  }

  /**
   * Draw HUD frame
   */
  drawHUDFrame() {
    this.ctx.save();
    
    // Draw corner brackets
    const cornerSize = 30;
    const margin = 20;
    
    this.ctx.strokeStyle = HUD.config.colors.primary;
    this.ctx.lineWidth = 2;
    
    // Top-left corner
    this.ctx.beginPath();
    this.ctx.moveTo(margin, margin);
    this.ctx.lineTo(margin + cornerSize, margin);
    this.ctx.moveTo(margin, margin);
    this.ctx.lineTo(margin, margin + cornerSize);
    this.ctx.stroke();
    
    // Top-right corner
    this.ctx.beginPath();
    this.ctx.moveTo(this.width - margin, margin);
    this.ctx.lineTo(this.width - margin - cornerSize, margin);
    this.ctx.moveTo(this.width - margin, margin);
    this.ctx.lineTo(this.width - margin, margin + cornerSize);
    this.ctx.stroke();
    
    // Bottom-left corner
    this.ctx.beginPath();
    this.ctx.moveTo(margin, this.height - margin);
    this.ctx.lineTo(margin + cornerSize, this.height - margin);
    this.ctx.moveTo(margin, this.height - margin);
    this.ctx.lineTo(margin, this.height - margin - cornerSize);
    this.ctx.stroke();
    
    // Bottom-right corner
    this.ctx.beginPath();
    this.ctx.moveTo(this.width - margin, this.height - margin);
    this.ctx.lineTo(this.width - margin - cornerSize, this.height - margin);
    this.ctx.moveTo(this.width - margin, this.height - margin);
    this.ctx.lineTo(this.width - margin, this.height - margin - cornerSize);
    this.ctx.stroke();
    
    // Draw header
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = HUD.config.colors.primary;
    this.ctx.textAlign = 'center';
    this.ctx.fillText('JARVIS INTERFACE v1.0', this.width / 2, margin + 10);
    
    // Draw timestamp
    const timestamp = generateTimestamp();
    this.ctx.font = '12px Arial';
    this.ctx.fillStyle = HUD.config.colors.primary;
    this.ctx.textAlign = 'right';
    this.ctx.fillText(timestamp, this.width - margin - 10, margin + 30);
    
    this.ctx.restore();
  }

  /**
   * Draw scan lines effect
   */
  drawScanLines() {
    this.ctx.save();
    
    // Draw horizontal scan lines
    this.ctx.strokeStyle = 'rgba(0, 162, 255, 0.1)';
    this.ctx.lineWidth = 1;
    
    const lineSpacing = 4;
    for (let y = 0; y < this.height; y += lineSpacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
    
    // Draw vignette effect
    const gradient = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, 0,
      this.width / 2, this.height / 2, this.width / 1.5
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 10, 20, 0.4)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.restore();
  }

  /**
   * Set target lock
   * @param {boolean} active - Whether target lock is active
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  setTargetLock(active, x, y) {
    this.elements.targetLock.active = active;
    
    if (active) {
      this.elements.targetLock.x = x;
      this.elements.targetLock.y = y;
      this.elements.targetLock.progress = 0;
    }
  }
}
