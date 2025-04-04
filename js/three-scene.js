/**
 * Enhanced Three.js scene for Iron Man HUD Interface
 * This file contains additional scene elements and effects
 */

class ThreeScene {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = null;
    this.objects = {};
    this.effects = {};
    this.initialized = false;
  }

  /**
   * Initialize Three.js scene
   */
  init() {
    if (this.initialized) return;

    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 5;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);
    
    // Set renderer canvas style
    const canvas = this.renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    
    // Create clock for animations
    this.clock = new THREE.Clock();
    
    // Add lighting
    this.addLighting();
    
    // Create objects
    this.createObjects();
    
    // Add post-processing effects
    this.addPostProcessing();
    
    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
    
    this.initialized = true;
    
    // Start animation loop
    this.animate();
  }

  /**
   * Add lighting to scene
   */
  addLighting() {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 5);
    this.scene.add(directionalLight);
    
    // Add point light (for glow effects)
    const pointLight = new THREE.PointLight(0x00a2ff, 1, 10);
    pointLight.position.set(0, 0, 2);
    this.scene.add(pointLight);
  }

  /**
   * Create Three.js objects
   */
  createObjects() {
    // Create arc reactor glow
    this.objects.arcReactorGlow = this.createArcReactorGlow();
    this.scene.add(this.objects.arcReactorGlow);
    
    // Create floating particles
    this.objects.particles = this.createFloatingParticles();
    this.scene.add(this.objects.particles);
    
    // Create holographic rings
    this.objects.rings = this.createHolographicRings();
    this.scene.add(this.objects.rings);
    
    // Create targeting grid
    this.objects.targetingGrid = this.createTargetingGrid();
    this.scene.add(this.objects.targetingGrid);
    
    // Create HUD frame
    this.objects.hudFrame = this.createHUDFrame();
    this.scene.add(this.objects.hudFrame);
  }

  /**
   * Create arc reactor glow effect
   * @returns {THREE.Mesh} Arc reactor glow mesh
   */
  createArcReactorGlow() {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const texture = this.createRadialGradientTexture(
      256, 
      HUD.config.colors.secondary, 
      'rgba(0, 0, 0, 0)'
    );
    
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -3;
    
    return mesh;
  }

  /**
   * Create floating particles
   * @returns {THREE.Points} Particles
   */
  createFloatingParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      // Size
      sizes[i] = Math.random() * 0.1 + 0.05;
      
      // Speed
      speeds[i] = Math.random() * 0.2 + 0.1;
      
      // Color
      const color = new THREE.Color();
      if (Math.random() > 0.7) {
        color.set(HUD.config.colors.secondary);
      } else {
        color.set(HUD.config.colors.primary);
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Store speeds for animation
    geometry.userData = { speeds };
    
    const material = new THREE.PointsMaterial({
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(geometry, material);
    
    return particles;
  }

  /**
   * Create holographic rings
   * @returns {THREE.Group} Rings group
   */
  createHolographicRings() {
    const group = new THREE.Group();
    
    // Create rings
    for (let i = 0; i < 3; i++) {
      const radius = 1 + i * 0.5;
      const segments = 64;
      const geometry = new THREE.RingGeometry(radius, radius + 0.05, segments);
      
      const material = new THREE.MeshBasicMaterial({
        color: HUD.config.colors.primary,
        transparent: true,
        opacity: 0.3 - i * 0.05,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(geometry, material);
      ring.rotation.x = Math.PI / 2;
      
      group.add(ring);
    }
    
    return group;
  }

  /**
   * Create targeting grid
   * @returns {THREE.Group} Targeting grid group
   */
  createTargetingGrid() {
    const group = new THREE.Group();
    
    // Create grid lines
    const gridSize = 10;
    const gridDivisions = 10;
    const gridStep = gridSize / gridDivisions;
    
    const gridMaterial = new THREE.LineBasicMaterial({
      color: HUD.config.colors.primary,
      transparent: true,
      opacity: 0.2
    });
    
    // Create horizontal lines
    for (let i = 0; i <= gridDivisions; i++) {
      const y = (i * gridStep) - (gridSize / 2);
      
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -gridSize / 2, y, 0,
        gridSize / 2, y, 0
      ]);
      
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      
      const line = new THREE.Line(geometry, gridMaterial);
      group.add(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= gridDivisions; i++) {
      const x = (i * gridStep) - (gridSize / 2);
      
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        x, -gridSize / 2, 0,
        x, gridSize / 2, 0
      ]);
      
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      
      const line = new THREE.Line(geometry, gridMaterial);
      group.add(line);
    }
    
    // Position grid
    group.position.z = -10;
    
    return group;
  }

  /**
   * Create HUD frame
   * @returns {THREE.Group} HUD frame group
   */
  createHUDFrame() {
    const group = new THREE.Group();
    
    // Create corner brackets
    const cornerSize = 0.5;
    const cornerThickness = 0.05;
    const cornerColor = HUD.config.colors.primary;
    
    const cornerMaterial = new THREE.LineBasicMaterial({
      color: cornerColor,
      transparent: true,
      opacity: 0.8
    });
    
    // Top-left corner
    const topLeftGeometry = new THREE.BufferGeometry();
    const topLeftVertices = new Float32Array([
      -2, 1, 0,
      -2, 1 - cornerSize, 0,
      -2, 1, 0,
      -2 + cornerSize, 1, 0
    ]);
    
    topLeftGeometry.setAttribute('position', new THREE.BufferAttribute(topLeftVertices, 3));
    const topLeftCorner = new THREE.Line(topLeftGeometry, cornerMaterial);
    group.add(topLeftCorner);
    
    // Top-right corner
    const topRightGeometry = new THREE.BufferGeometry();
    const topRightVertices = new Float32Array([
      2, 1, 0,
      2, 1 - cornerSize, 0,
      2, 1, 0,
      2 - cornerSize, 1, 0
    ]);
    
    topRightGeometry.setAttribute('position', new THREE.BufferAttribute(topRightVertices, 3));
    const topRightCorner = new THREE.Line(topRightGeometry, cornerMaterial);
    group.add(topRightCorner);
    
    // Bottom-left corner
    const bottomLeftGeometry = new THREE.BufferGeometry();
    const bottomLeftVertices = new Float32Array([
      -2, -1, 0,
      -2, -1 + cornerSize, 0,
      -2, -1, 0,
      -2 + cornerSize, -1, 0
    ]);
    
    bottomLeftGeometry.setAttribute('position', new THREE.BufferAttribute(bottomLeftVertices, 3));
    const bottomLeftCorner = new THREE.Line(bottomLeftGeometry, cornerMaterial);
    group.add(bottomLeftCorner);
    
    // Bottom-right corner
    const bottomRightGeometry = new THREE.BufferGeometry();
    const bottomRightVertices = new Float32Array([
      2, -1, 0,
      2, -1 + cornerSize, 0,
      2, -1, 0,
      2 - cornerSize, -1, 0
    ]);
    
    bottomRightGeometry.setAttribute('position', new THREE.BufferAttribute(bottomRightVertices, 3));
    const bottomRightCorner = new THREE.Line(bottomRightGeometry, cornerMaterial);
    group.add(bottomRightCorner);
    
    // Position frame
    group.position.z = -1;
    
    return group;
  }

  /**
   * Add post-processing effects
   */
  addPostProcessing() {
    // This would be implemented with THREE.EffectComposer
    // For simplicity, we'll skip actual implementation but leave the method
    // as a placeholder for future enhancement
  }

  /**
   * Create a radial gradient texture
   * @param {number} size - Texture size
   * @param {string} innerColor - Inner color
   * @param {string} outerColor - Outer color
   * @returns {THREE.Texture} Radial gradient texture
   */
  createRadialGradientTexture(size, innerColor, outerColor) {
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
   * Handle window resize
   */
  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Animation loop
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    
    if (!this.initialized) return;
    
    // Get delta time
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    
    // Update objects
    this.updateObjects(delta, elapsedTime);
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Update Three.js objects
   * @param {number} delta - Delta time
   * @param {number} elapsedTime - Elapsed time
   */
  updateObjects(delta, elapsedTime) {
    // Update arc reactor glow
    if (this.objects.arcReactorGlow) {
      this.objects.arcReactorGlow.rotation.z += delta * 0.2;
      
      // Pulse effect
      const pulse = Math.sin(elapsedTime * 2) * 0.1 + 0.9;
      this.objects.arcReactorGlow.scale.set(pulse, pulse, 1);
    }
    
    // Update particles
    if (this.objects.particles) {
      const positions = this.objects.particles.geometry.attributes.position.array;
      const speeds = this.objects.particles.geometry.userData.speeds;
      
      for (let i = 0; i < positions.length / 3; i++) {
        // Move particles
        positions[i * 3 + 1] += delta * speeds[i];
        
        // Reset particles that go too far
        if (positions[i * 3 + 1] > 7.5) {
          positions[i * 3 + 1] = -7.5;
          positions[i * 3] = (Math.random() - 0.5) * 15;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
      }
      
      this.objects.particles.geometry.attributes.position.needsUpdate = true;
      this.objects.particles.rotation.y += delta * 0.05;
    }
    
    // Update rings
    if (this.objects.rings) {
      this.objects.rings.rotation.x += delta * 0.1;
      this.objects.rings.rotation.y += delta * 0.2;
    }
    
    // Update targeting grid
    if (this.objects.targetingGrid) {
      // Subtle movement
      this.objects.targetingGrid.rotation.x = Math.sin(elapsedTime * 0.2) * 0.05;
      this.objects.targetingGrid.rotation.y = Math.cos(elapsedTime * 0.3) * 0.05;
    }
    
    // Update HUD frame
    if (this.objects.hudFrame) {
      // Subtle breathing effect
      const breathe = Math.sin(elapsedTime * 0.5) * 0.02 + 1;
      this.objects.hudFrame.scale.set(breathe, breathe, 1);
    }
  }

  /**
   * Update camera based on gaze position
   * @param {Object} gazePosition - Gaze position {x, y}
   */
  updateCameraFromGaze(gazePosition) {
    if (!this.camera || !gazePosition) return;
    
    // Get viewport center
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Calculate offset from center (normalized -1 to 1)
    const offsetX = (gazePosition.x - centerX) / centerX;
    const offsetY = (gazePosition.y - centerY) / centerY;
    
    // Apply rotation to camera with smooth transition
    const rotationFactor = HUD.config.eyeTracking.cameraRotationFactor;
    const targetRotationY = -offsetX * rotationFactor;
    const targetRotationX = offsetY * rotationFactor;
    
    // Smooth transition
    this.camera.rotation.y += (targetRotationY - this.camera.rotation.y) * 0.1;
    this.camera.rotation.x += (targetRotationX - this.camera.rotation.x) * 0.1;
  }

  /**
   * Add target indicator
   * @param {Object} position - Position {x, y, z}
   * @returns {THREE.Group} Target indicator group
   */
  addTargetIndicator(position) {
    const group = new THREE.Group();
    
    // Create target indicator
    const ringGeometry = new THREE.RingGeometry(0.2, 0.25, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3030,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    
    // Create crosshair
    const crosshairMaterial = new THREE.LineBasicMaterial({
      color: 0xff3030,
      transparent: true,
      opacity: 0.8
    });
    
    const horizontalGeometry = new THREE.BufferGeometry();
    const horizontalVertices = new Float32Array([
      -0.3, 0, 0,
      0.3, 0, 0
    ]);
    
    horizontalGeometry.setAttribute('position', new THREE.BufferAttribute(horizontalVertices, 3));
    const horizontalLine = new THREE.Line(horizontalGeometry, crosshairMaterial);
    
    const verticalGeometry = new THREE.BufferGeometry();
    const verticalVertices = new Float32Array([
      0, -0.3, 0,
      0, 0.3, 0
    ]);
    
    verticalGeometry.setAttribute('position', new THREE.BufferAttribute(verticalVertices, 3));
    const verticalLine = new THREE.Line(verticalGeometry, crosshairMaterial);
    
    // Assemble target indicator
    group.add(ring);
    group.add(horizontalLine);
    group.add(verticalLine);
    
    // Position indicator
    group.position.set(position.x, position.y, position.z);
    
    // Add to scene
    this.scene.add(group);
    
    // Store reference
    const id = Date.now();
    this.objects[`target_${id}`] = group;
    
    return group;
  }

  /**
   * Remove target indicator
   * @param {THREE.Group} targetIndicator - Target indicator to remove
   */
  removeTargetIndicator(targetIndicator) {
    if (!targetIndicator) return;
    
    this.scene.remove(targetIndicator);
    
    // Find and remove reference
    for (const key in this.objects) {
      if (this.objects[key] === targetIndicator) {
        delete this.objects[key];
        break;
      }
    }
  }
}
