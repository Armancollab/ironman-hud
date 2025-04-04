/**
 * HUD Elements for Iron Man Interface
 */

// HUD Elements Class
class HUDElements {
  constructor() {
    this.elements = {};
    this.animations = {};
  }

  /**
   * Initialize HUD elements
   */
  init() {
    this.createArcReactor();
    this.createRadar();
    this.createStatusPanels();
    this.createTargetIdentification();
    this.createDataVisualizations();
  }

  /**
   * Create Arc Reactor energy meter
   */
  createArcReactor() {
    // Create container
    const arcReactorContainer = document.createElement('div');
    arcReactorContainer.className = 'hud-element arc-reactor';
    arcReactorContainer.style.bottom = '30px';
    arcReactorContainer.style.left = '50%';
    arcReactorContainer.style.transform = 'translateX(-50%)';
    arcReactorContainer.style.width = '200px';
    arcReactorContainer.style.height = '200px';
    arcReactorContainer.style.borderRadius = '50%';
    arcReactorContainer.style.display = 'flex';
    arcReactorContainer.style.justifyContent = 'center';
    arcReactorContainer.style.alignItems = 'center';
    arcReactorContainer.style.background = 'radial-gradient(circle, rgba(0,162,255,0.2) 0%, rgba(0,10,20,0.8) 70%)';
    arcReactorContainer.style.border = '2px solid ' + HUD.config.colors.primary;
    arcReactorContainer.style.boxShadow = '0 0 20px ' + HUD.config.colors.glow;
    arcReactorContainer.setAttribute('data-activatable', 'true');
    arcReactorContainer.setAttribute('data-name', 'arc-reactor');

    // Create inner circle
    const innerCircle = document.createElement('div');
    innerCircle.className = 'arc-reactor-inner';
    innerCircle.style.width = '70%';
    innerCircle.style.height = '70%';
    innerCircle.style.borderRadius = '50%';
    innerCircle.style.background = 'radial-gradient(circle, ' + HUD.config.colors.secondary + ' 0%, ' + HUD.config.colors.primary + ' 70%)';
    innerCircle.style.boxShadow = '0 0 15px ' + HUD.config.colors.glow;
    innerCircle.style.position = 'relative';
    innerCircle.style.display = 'flex';
    innerCircle.style.justifyContent = 'center';
    innerCircle.style.alignItems = 'center';

    // Create energy level text
    const energyLevel = document.createElement('div');
    energyLevel.className = 'arc-reactor-energy';
    energyLevel.style.color = HUD.config.colors.accent;
    energyLevel.style.fontSize = '24px';
    energyLevel.style.fontWeight = 'bold';
    energyLevel.textContent = HUD.state.systemStatus.arcReactorPower + '%';

    // Create rings
    for (let i = 0; i < 3; i++) {
      const ring = document.createElement('div');
      ring.className = 'arc-reactor-ring';
      ring.style.position = 'absolute';
      ring.style.top = '50%';
      ring.style.left = '50%';
      ring.style.transform = 'translate(-50%, -50%)';
      ring.style.width = (85 - i * 15) + '%';
      ring.style.height = (85 - i * 15) + '%';
      ring.style.borderRadius = '50%';
      ring.style.border = '1px solid ' + HUD.config.colors.primary;
      ring.style.boxShadow = '0 0 5px ' + HUD.config.colors.glow;
      ring.style.animation = 'pulse ' + (2 + i * 0.5) + 's infinite';
      arcReactorContainer.appendChild(ring);
    }

    // Create progress ring
    const progressRing = document.createElement('div');
    progressRing.className = 'arc-reactor-progress';
    progressRing.style.position = 'absolute';
    progressRing.style.top = '0';
    progressRing.style.left = '0';
    progressRing.style.width = '100%';
    progressRing.style.height = '100%';
    progressRing.style.borderRadius = '50%';
    progressRing.style.background = 'conic-gradient(' + HUD.config.colors.primary + ' ' + HUD.state.systemStatus.arcReactorPower + '%, transparent ' + HUD.state.systemStatus.arcReactorPower + '%)';
    progressRing.style.opacity = '0.8';

    // Assemble
    innerCircle.appendChild(energyLevel);
    arcReactorContainer.appendChild(progressRing);
    arcReactorContainer.appendChild(innerCircle);
    
    // Store reference
    this.elements.arcReactor = {
      container: arcReactorContainer,
      energyLevel: energyLevel,
      progressRing: progressRing
    };

    // Add to DOM
    document.getElementById('hud-interface').appendChild(arcReactorContainer);
  }

  /**
   * Create radar/minimap
   */
  createRadar() {
    // Create container
    const radarContainer = document.createElement('div');
    radarContainer.className = 'hud-element radar';
    radarContainer.style.top = '30px';
    radarContainer.style.left = '30px';
    radarContainer.style.width = '200px';
    radarContainer.style.height = '200px';
    radarContainer.style.borderRadius = '50%';
    radarContainer.style.background = 'radial-gradient(circle, rgba(0,162,255,0.1) 0%, rgba(0,10,20,0.7) 70%)';
    radarContainer.style.border = '2px solid ' + HUD.config.colors.primary;
    radarContainer.style.boxShadow = '0 0 15px ' + HUD.config.colors.glow;
    radarContainer.style.position = 'relative';
    radarContainer.style.overflow = 'hidden';
    radarContainer.setAttribute('data-activatable', 'true');
    radarContainer.setAttribute('data-name', 'radar');

    // Create radar header
    const radarHeader = document.createElement('div');
    radarHeader.className = 'hud-element-header';
    radarHeader.style.position = 'absolute';
    radarHeader.style.top = '10px';
    radarHeader.style.left = '0';
    radarHeader.style.width = '100%';
    radarHeader.style.textAlign = 'center';
    radarHeader.textContent = 'PROXIMITY SCAN';

    // Create radar sweep
    const radarSweep = document.createElement('div');
    radarSweep.className = 'radar-sweep';
    radarSweep.style.position = 'absolute';
    radarSweep.style.top = '0';
    radarSweep.style.left = '0';
    radarSweep.style.width = '100%';
    radarSweep.style.height = '100%';
    radarSweep.style.background = 'conic-gradient(rgba(0,162,255,0.8) 0deg, transparent 30deg, transparent 360deg)';
    radarSweep.style.animation = 'rotate 4s linear infinite';

    // Create radar grid
    const radarGrid = document.createElement('div');
    radarGrid.className = 'radar-grid';
    radarGrid.style.position = 'absolute';
    radarGrid.style.top = '0';
    radarGrid.style.left = '0';
    radarGrid.style.width = '100%';
    radarGrid.style.height = '100%';
    radarGrid.style.borderRadius = '50%';

    // Create grid circles
    for (let i = 1; i <= 3; i++) {
      const circle = document.createElement('div');
      circle.style.position = 'absolute';
      circle.style.top = '50%';
      circle.style.left = '50%';
      circle.style.transform = 'translate(-50%, -50%)';
      circle.style.width = (i * 33) + '%';
      circle.style.height = (i * 33) + '%';
      circle.style.borderRadius = '50%';
      circle.style.border = '1px solid ' + HUD.config.colors.primary;
      circle.style.opacity = '0.5';
      radarGrid.appendChild(circle);
    }

    // Create grid lines
    for (let i = 0; i < 4; i++) {
      const line = document.createElement('div');
      line.style.position = 'absolute';
      line.style.top = '50%';
      line.style.left = '0';
      line.style.width = '100%';
      line.style.height = '1px';
      line.style.backgroundColor = HUD.config.colors.primary;
      line.style.opacity = '0.5';
      line.style.transform = 'rotate(' + (i * 45) + 'deg)';
      radarGrid.appendChild(line);
    }

    // Create center point
    const centerPoint = document.createElement('div');
    centerPoint.style.position = 'absolute';
    centerPoint.style.top = '50%';
    centerPoint.style.left = '50%';
    centerPoint.style.transform = 'translate(-50%, -50%)';
    centerPoint.style.width = '6px';
    centerPoint.style.height = '6px';
    centerPoint.style.borderRadius = '50%';
    centerPoint.style.backgroundColor = HUD.config.colors.secondary;
    centerPoint.style.boxShadow = '0 0 5px ' + HUD.config.colors.glow;

    // Create random blips
    for (let i = 0; i < 5; i++) {
      const blip = document.createElement('div');
      blip.className = 'radar-blip';
      blip.style.position = 'absolute';
      
      // Random position (polar coordinates)
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 65; // % from center
      const x = 50 + Math.cos(angle) * distance / 2;
      const y = 50 + Math.sin(angle) * distance / 2;
      
      blip.style.top = y + '%';
      blip.style.left = x + '%';
      blip.style.width = '4px';
      blip.style.height = '4px';
      blip.style.borderRadius = '50%';
      blip.style.backgroundColor = i === 0 ? '#ff3030' : HUD.config.colors.secondary;
      blip.style.boxShadow = '0 0 5px ' + (i === 0 ? '#ff3030' : HUD.config.colors.glow);
      blip.style.transform = 'translate(-50%, -50%)';
      blip.style.animation = 'pulse ' + (1 + Math.random()) + 's infinite';
      
      radarContainer.appendChild(blip);
    }

    // Assemble
    radarContainer.appendChild(radarGrid);
    radarContainer.appendChild(radarSweep);
    radarContainer.appendChild(centerPoint);
    radarContainer.appendChild(radarHeader);
    
    // Store reference
    this.elements.radar = {
      container: radarContainer,
      sweep: radarSweep
    };

    // Add to DOM
    document.getElementById('hud-interface').appendChild(radarContainer);
  }

  /**
   * Create system status panels
   */
  createStatusPanels() {
    // Create container
    const statusContainer = document.createElement('div');
    statusContainer.className = 'hud-element status-panels';
    statusContainer.style.top = '30px';
    statusContainer.style.right = '30px';
    statusContainer.style.width = '250px';
    statusContainer.style.padding = '15px';
    statusContainer.setAttribute('data-activatable', 'true');
    statusContainer.setAttribute('data-name', 'system-status');

    // Create header
    const header = document.createElement('div');
    header.className = 'hud-element-header';
    header.textContent = 'SYSTEM STATUS';
    header.style.marginBottom = '15px';
    header.style.textAlign = 'center';
    header.style.position = 'relative';
    
    // Add underline to header
    const underline = document.createElement('div');
    underline.style.position = 'absolute';
    underline.style.bottom = '-5px';
    underline.style.left = '0';
    underline.style.width = '100%';
    underline.style.height = '1px';
    underline.style.backgroundColor = HUD.config.colors.primary;
    underline.style.boxShadow = '0 0 5px ' + HUD.config.colors.glow;
    header.appendChild(underline);

    // Create status items
    const statusItems = [
      { name: 'ARC REACTOR', value: HUD.state.systemStatus.arcReactorPower + '%', color: getStatusColor(HUD.state.systemStatus.arcReactorPower) },
      { name: 'SYSTEM INTEGRITY', value: HUD.state.systemStatus.systemIntegrity + '%', color: getStatusColor(HUD.state.systemStatus.systemIntegrity) },
      { name: 'SHIELD STATUS', value: HUD.state.systemStatus.shieldStatus + '%', color: getStatusColor(HUD.state.systemStatus.shieldStatus) },
      { name: 'PROPULSION', value: HUD.state.systemStatus.propulsionPower + '%', color: getStatusColor(HUD.state.systemStatus.propulsionPower) }
    ];

    const statusItemsContainer = document.createElement('div');
    statusItemsContainer.style.display = 'flex';
    statusItemsContainer.style.flexDirection = 'column';
    statusItemsContainer.style.gap = '10px';

    statusItems.forEach(item => {
      const statusItem = document.createElement('div');
      statusItem.className = 'status-item';
      statusItem.style.display = 'flex';
      statusItem.style.flexDirection = 'column';
      statusItem.style.gap = '5px';

      const itemHeader = document.createElement('div');
      itemHeader.style.display = 'flex';
      itemHeader.style.justifyContent = 'space-between';
      itemHeader.style.fontSize = '12px';

      const itemName = document.createElement('span');
      itemName.textContent = item.name;
      itemName.style.color = HUD.config.colors.primary;

      const itemValue = document.createElement('span');
      itemValue.textContent = item.value;
      itemValue.style.color = item.color;

      const progressBar = document.createElement('div');
      progressBar.style.width = '100%';
      progressBar.style.height = '4px';
      progressBar.style.backgroundColor = 'rgba(0, 162, 255, 0.2)';
      progressBar.style.position = 'relative';
      progressBar.style.overflow = 'hidden';

      const progressFill = document.createElement('div');
      progressFill.style.position = 'absolute';
      progressFill.style.top = '0';
      progressFill.style.left = '0';
      progressFill.style.width = item.value;
      progressFill.style.height = '100%';
      progressFill.style.backgroundColor = item.color;
      progressFill.style.boxShadow = '0 0 5px ' + item.color;

      // Assemble status item
      itemHeader.appendChild(itemName);
      itemHeader.appendChild(itemValue);
      progressBar.appendChild(progressFill);
      statusItem.appendChild(itemHeader);
      statusItem.appendChild(progressBar);
      statusItemsContainer.appendChild(statusItem);
    });

    // Create system data
    const systemData = generateRandomSystemData();
    const systemDataContainer = document.createElement('div');
    systemDataContainer.style.marginTop = '20px';
    systemDataContainer.style.padding = '10px';
    systemDataContainer.style.backgroundColor = 'rgba(0, 10, 20, 0.5)';
    systemDataContainer.style.border = '1px solid ' + HUD.config.colors.primary;
    systemDataContainer.style.borderRadius = '5px';

    const dataHeader = document.createElement('div');
    dataHeader.className = 'hud-element-header';
    dataHeader.textContent = 'DIAGNOSTICS';
    dataHeader.style.fontSize = '12px';
    dataHeader.style.marginBottom = '10px';
    dataHeader.style.textAlign = 'center';

    const dataGrid = document.createElement('div');
    dataGrid.style.display = 'grid';
    dataGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    dataGrid.style.gap = '8px';
    dataGrid.style.fontSize = '11px';

    const dataItems = [
      { name: 'CPU USAGE', value: systemData.cpuUsage + '%' },
      { name: 'MEMORY', value: systemData.memoryUsage + '%' },
      { name: 'TEMP', value: systemData.temperature + '°C' },
      { name: 'LATENCY', value: systemData.networkLatency + 'ms' }
    ];

    dataItems.forEach(item => {
      const dataItem = document.createElement('div');
      dataItem.style.display = 'flex';
      dataItem.style.justifyContent = 'space-between';

      const itemName = document.createElement('span');
      itemName.textContent = item.name;
      itemName.style.color = HUD.config.colors.primary;

      const itemValue = document.createElement('span');
      itemValue.textContent = item.value;
      itemValue.style.color = HUD.config.colors.accent;

      dataItem.appendChild(itemName);
      dataItem.appendChild(itemValue);
      dataGrid.appendChild(dataItem);
    });

    // Assemble system data
    systemDataContainer.appendChild(dataHeader);
    systemDataContainer.appendChild(dataGrid);

    // Assemble status panel
    statusContainer.appendChild(header);
    statusContainer.appendChild(statusItemsContainer);
    statusContainer.appendChild(systemDataContainer);
    
    // Store reference
    this.elements.statusPanels = {
      container: statusContainer,
      items: statusItemsContainer
    };

    // Add to DOM
    document.getElementById('hud-interface').appendChild(statusContainer);
  }

  /**
   * Create target identification overlay
   */
  createTargetIdentification() {
    // Create container
    const targetContainer = document.createElement('div');
    targetContainer.className = 'hud-element target-id';
    targetContainer.style.display = 'none'; // Hidden by default, shown when target is detected
    targetContainer.style.position = 'absolute';
    targetContainer.style.border = '2px solid ' + HUD.config.colors.primary;
    targetContainer.style.boxShadow = '0 0 10px ' + HUD.config.colors.glow;
    targetContainer.style.backgroundColor = 'rgba(0, 10, 20, 0.3)';
    targetContainer.style.padding = '5px';
    targetContainer.style.borderRadius = '5px';
    targetContainer.style.pointerEvents = 'none';
    targetContainer.setAttribute('data-activatable', 'true');
    targetContainer.setAttribute('data-name', 'target-id');

    // Create target corners (for bounding box effect)
    const corners = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
    corners.forEach(corner => {
      const cornerElement = document.createElement('div');
      cornerElement.className = 'target-corner ' + corner;
      cornerElement.style.position = 'absolute';
      cornerElement.style.width = '10px';
      cornerElement.style.height = '10px';
      cornerElement.style.borderColor = HUD.config.colors.secondary;
      cornerElement.style.borderStyle = 'solid';
      cornerElement.style.borderWidth = '0';
      
      // Set corner-specific styles
      if (corner === 'top-left') {
        cornerElement.style.top = '-2px';
        cornerElement.style.left = '-2px';
        cornerElement.style.borderTopWidth = '2px';
        cornerElement.style.borderLeftWidth = '2px';
      } else if (corner === 'top-right') {
        cornerElement.style.top = '-2px';
        cornerElement.style.right = '-2px';
        cornerElement.style.borderTopWidth = '2px';
        cornerElement.style.borderRightWidth = '2px';
      } else if (corner === 'bottom-right') {
        cornerElement.style.bottom = '-2px';
        cornerElement.style.right = '-2px';
        cornerElement.style.borderBottomWidth = '2px';
        cornerElement.style.borderRightWidth = '2px';
      } else if (corner === 'bottom-left') {
        cornerElement.style.bottom = '-2px';
        cornerElement.style.left = '-2px';
        cornerElement.style.borderBottomWidth = '2px';
        cornerElement.style.borderLeftWidth = '2px';
      }
      
      targetContainer.appendChild(cornerElement);
    });

    // Create target info panel
    const targetInfo = document.createElement('div');
    targetInfo.className = 'target-info';
    targetInfo.style.position = 'absolute';
    targetInfo.style.top = 'calc(100% + 10px)';
    targetInfo.style.left = '0';
    targetInfo.style.width = '200px';
    targetInfo.style.backgroundColor = 'rgba(0, 10, 20, 0.7)';
    targetInfo.style.border = '1px solid ' + HUD.config.colors.primary;
    targetInfo.style.borderRadius = '5px';
    targetInfo.style.padding = '8px';
    targetInfo.style.fontSize = '12px';

    // Create target header
    const targetHeader = document.createElement('div');
    targetHeader.className = 'target-header';
    targetHeader.style.display = 'flex';
    targetHeader.style.justifyContent = 'space-between';
    targetHeader.style.marginBottom = '5px';
    targetHeader.style.borderBottom = '1px solid ' + HUD.config.colors.primary;
    targetHeader.style.paddingBottom = '5px';

    const targetTitle = document.createElement('div');
    targetTitle.className = 'target-title';
    targetTitle.textContent = 'TARGET IDENTIFIED';
    targetTitle.style.color = HUD.config.colors.primary;
    targetTitle.style.fontWeight = 'bold';

    const targetDistance = document.createElement('div');
    targetDistance.className = 'target-distance';
    targetDistance.textContent = '-- m';
    targetDistance.style.color = HUD.config.colors.secondary;

    targetHeader.appendChild(targetTitle);
    targetHeader.appendChild(targetDistance);

    // Create target details
    const targetDetails = document.createElement('div');
    targetDetails.className = 'target-details';
    targetDetails.style.display = 'flex';
    targetDetails.style.flexDirection = 'column';
    targetDetails.style.gap = '5px';

    const detailItems = [
      { name: 'TYPE', value: '---' },
      { name: 'STATUS', value: '---' },
      { name: 'THREAT', value: '---' }
    ];

    detailItems.forEach(item => {
      const detailItem = document.createElement('div');
      detailItem.style.display = 'flex';
      detailItem.style.justifyContent = 'space-between';

      const itemName = document.createElement('span');
      itemName.textContent = item.name;
      itemName.style.color = HUD.config.colors.primary;

      const itemValue = document.createElement('span');
      itemValue.className = 'target-' + item.name.toLowerCase();
      itemValue.textContent = item.value;
      itemValue.style.color = HUD.config.colors.accent;

      detailItem.appendChild(itemName);
      detailItem.appendChild(itemValue);
      targetDetails.appendChild(detailItem);
    });

    // Assemble target info
    targetInfo.appendChild(targetHeader);
    targetInfo.appendChild(targetDetails);
    targetContainer.appendChild(targetInfo);
    
    // Store reference
    this.elements.targetId = {
      container: targetContainer,
      info: targetInfo,
      distance: targetDistance,
      type: targetInfo.querySelector('.target-type'),
      status: targetInfo.querySelector('.target-status'),
      threat: targetInfo.querySelector('.target-threat')
    };

    // Add to DOM
    document.getElementById('hud-interface').appendChild(targetContainer);
  }

  /**
   * Create data visualizations
   */
  createDataVisualizations() {
    // Create container
    const dataContainer = document.createElement('div');
    dataContainer.className = 'hud-element data-viz';
    dataContainer.style.bottom = '30px';
    dataContainer.style.right = '30px';
    dataContainer.style.width = '300px';
    dataContainer.style.padding = '15px';
    dataContainer.setAttribute('data-activatable', 'true');
    dataContainer.setAttribute('data-name', 'data-visualization');

    // Create header
    const header = document.createElement('div');
    header.className = 'hud-element-header';
    header.textContent = 'PERFORMANCE METRICS';
    header.style.marginBottom = '15px';
    header.style.textAlign = 'center';
    header.style.position = 'relative';
    
    // Add underline to header
    const underline = document.createElement('div');
    underline.style.position = 'absolute';
    underline.style.bottom = '-5px';
    underline.style.left = '0';
    underline.style.width = '100%';
    underline.style.height = '1px';
    underline.style.backgroundColor = HUD.config.colors.primary;
    underline.style.boxShadow = '0 0 5px ' + HUD.config.colors.glow;
    header.appendChild(underline);

    // Create line graph
    const lineGraphContainer = document.createElement('div');
    lineGraphContainer.className = 'line-graph-container';
    lineGraphContainer.style.height = '120px';
    lineGraphContainer.style.marginBottom = '20px';
    lineGraphContainer.style.position = 'relative';
    lineGraphContainer.style.border = '1px solid ' + HUD.config.colors.primary;
    lineGraphContainer.style.borderRadius = '5px';
    lineGraphContainer.style.padding = '10px';
    lineGraphContainer.style.backgroundColor = 'rgba(0, 10, 20, 0.5)';

    // Create graph title
    const graphTitle = document.createElement('div');
    graphTitle.className = 'graph-title';
    graphTitle.textContent = 'SYSTEM PERFORMANCE';
    graphTitle.style.fontSize = '12px';
    graphTitle.style.color = HUD.config.colors.primary;
    graphTitle.style.marginBottom = '10px';

    // Create canvas for line graph
    const lineGraphCanvas = document.createElement('canvas');
    lineGraphCanvas.className = 'line-graph';
    lineGraphCanvas.style.width = '100%';
    lineGraphCanvas.style.height = '80px';
    
    // Create radial charts container
    const radialChartsContainer = document.createElement('div');
    radialChartsContainer.className = 'radial-charts-container';
    radialChartsContainer.style.display = 'flex';
    radialChartsContainer.style.justifyContent = 'space-between';
    radialChartsContainer.style.marginBottom = '20px';

    // Create radial charts
    const radialChartData = [
      { name: 'CPU', value: 68 },
      { name: 'MEM', value: 45 },
      { name: 'NET', value: 82 }
    ];

    radialChartData.forEach(data => {
      const radialChart = document.createElement('div');
      radialChart.className = 'radial-chart';
      radialChart.style.width = '80px';
      radialChart.style.height = '80px';
      radialChart.style.position = 'relative';
      radialChart.style.display = 'flex';
      radialChart.style.justifyContent = 'center';
      radialChart.style.alignItems = 'center';

      // Create progress circle
      const progressCircle = document.createElement('div');
      progressCircle.style.width = '100%';
      progressCircle.style.height = '100%';
      progressCircle.style.borderRadius = '50%';
      progressCircle.style.background = 'conic-gradient(' + HUD.config.colors.primary + ' ' + data.value + '%, transparent ' + data.value + '%)';
      progressCircle.style.position = 'absolute';
      
      // Create inner circle
      const innerCircle = document.createElement('div');
      innerCircle.style.width = '70%';
      innerCircle.style.height = '70%';
      innerCircle.style.borderRadius = '50%';
      innerCircle.style.backgroundColor = 'rgba(0, 10, 20, 0.8)';
      innerCircle.style.position = 'absolute';
      innerCircle.style.display = 'flex';
      innerCircle.style.justifyContent = 'center';
      innerCircle.style.alignItems = 'center';
      innerCircle.style.flexDirection = 'column';
      
      // Create value text
      const valueText = document.createElement('div');
      valueText.textContent = data.value + '%';
      valueText.style.color = HUD.config.colors.accent;
      valueText.style.fontSize = '16px';
      valueText.style.fontWeight = 'bold';
      
      // Create name text
      const nameText = document.createElement('div');
      nameText.textContent = data.name;
      nameText.style.color = HUD.config.colors.primary;
      nameText.style.fontSize = '10px';
      
      // Assemble radial chart
      innerCircle.appendChild(valueText);
      innerCircle.appendChild(nameText);
      radialChart.appendChild(progressCircle);
      radialChart.appendChild(innerCircle);
      radialChartsContainer.appendChild(radialChart);
    });

    // Create timeline progress bar
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'timeline-container';
    timelineContainer.style.position = 'relative';
    timelineContainer.style.height = '40px';
    timelineContainer.style.border = '1px solid ' + HUD.config.colors.primary;
    timelineContainer.style.borderRadius = '5px';
    timelineContainer.style.padding = '10px';
    timelineContainer.style.backgroundColor = 'rgba(0, 10, 20, 0.5)';

    // Create timeline title
    const timelineTitle = document.createElement('div');
    timelineTitle.className = 'timeline-title';
    timelineTitle.textContent = 'MISSION PROGRESS';
    timelineTitle.style.fontSize = '12px';
    timelineTitle.style.color = HUD.config.colors.primary;
    timelineTitle.style.marginBottom = '5px';

    // Create timeline progress
    const timelineProgress = document.createElement('div');
    timelineProgress.className = 'timeline-progress';
    timelineProgress.style.height = '4px';
    timelineProgress.style.backgroundColor = 'rgba(0, 162, 255, 0.2)';
    timelineProgress.style.position = 'relative';
    timelineProgress.style.borderRadius = '2px';
    timelineProgress.style.overflow = 'hidden';

    // Create timeline fill
    const timelineFill = document.createElement('div');
    timelineFill.className = 'timeline-fill';
    timelineFill.style.position = 'absolute';
    timelineFill.style.top = '0';
    timelineFill.style.left = '0';
    timelineFill.style.width = '35%';
    timelineFill.style.height = '100%';
    timelineFill.style.backgroundColor = HUD.config.colors.primary;
    timelineFill.style.boxShadow = '0 0 5px ' + HUD.config.colors.glow;

    // Create timeline markers
    for (let i = 0; i <= 4; i++) {
      const marker = document.createElement('div');
      marker.className = 'timeline-marker';
      marker.style.position = 'absolute';
      marker.style.top = '-3px';
      marker.style.left = (i * 25) + '%';
      marker.style.width = '2px';
      marker.style.height = '10px';
      marker.style.backgroundColor = i <= 1 ? HUD.config.colors.secondary : HUD.config.colors.primary;
      marker.style.opacity = i <= 1 ? '1' : '0.5';
      
      timelineProgress.appendChild(marker);
    }

    // Assemble timeline
    timelineProgress.appendChild(timelineFill);
    timelineContainer.appendChild(timelineTitle);
    timelineContainer.appendChild(timelineProgress);

    // Assemble line graph
    lineGraphContainer.appendChild(graphTitle);
    lineGraphContainer.appendChild(lineGraphCanvas);

    // Assemble data visualization
    dataContainer.appendChild(header);
    dataContainer.appendChild(lineGraphContainer);
    dataContainer.appendChild(radialChartsContainer);
    dataContainer.appendChild(timelineContainer);
    
    // Store reference
    this.elements.dataViz = {
      container: dataContainer,
      lineGraph: lineGraphCanvas,
      radialCharts: radialChartsContainer,
      timeline: timelineContainer,
      timelineFill: timelineFill
    };

    // Add to DOM
    document.getElementById('hud-interface').appendChild(dataContainer);
  }

  /**
   * Update HUD elements
   */
  update() {
    this.updateArcReactor();
    this.updateRadar();
    this.updateStatusPanels();
    this.updateDataVisualizations();
  }

  /**
   * Update Arc Reactor energy meter
   */
  updateArcReactor() {
    if (!this.elements.arcReactor) return;
    
    // Simulate energy fluctuation
    HUD.state.systemStatus.arcReactorPower = clamp(
      HUD.state.systemStatus.arcReactorPower + randomBetween(-1, 1),
      60,
      100
    );
    
    // Update display
    this.elements.arcReactor.energyLevel.textContent = Math.round(HUD.state.systemStatus.arcReactorPower) + '%';
    this.elements.arcReactor.progressRing.style.background = 'conic-gradient(' + 
      HUD.config.colors.primary + ' ' + 
      HUD.state.systemStatus.arcReactorPower + '%, transparent ' + 
      HUD.state.systemStatus.arcReactorPower + '%)';
  }

  /**
   * Update radar/minimap
   */
  updateRadar() {
    if (!this.elements.radar) return;
    
    // Update blips (random movement)
    const blips = this.elements.radar.container.querySelectorAll('.radar-blip');
    blips.forEach(blip => {
      // Get current position
      const style = window.getComputedStyle(blip);
      let top = parseFloat(style.top);
      let left = parseFloat(style.left);
      
      // Add random movement
      top += randomBetween(-0.5, 0.5);
      left += randomBetween(-0.5, 0.5);
      
      // Keep within bounds
      top = clamp(top, 10, 90);
      left = clamp(left, 10, 90);
      
      // Update position
      blip.style.top = top + '%';
      blip.style.left = left + '%';
    });
  }

  /**
   * Update status panels
   */
  updateStatusPanels() {
    if (!this.elements.statusPanels) return;
    
    // Simulate status fluctuations
    HUD.state.systemStatus.systemIntegrity = clamp(
      HUD.state.systemStatus.systemIntegrity + randomBetween(-0.5, 0.5),
      70,
      100
    );
    
    HUD.state.systemStatus.shieldStatus = clamp(
      HUD.state.systemStatus.shieldStatus + randomBetween(-1, 1),
      50,
      100
    );
    
    HUD.state.systemStatus.propulsionPower = clamp(
      HUD.state.systemStatus.propulsionPower + randomBetween(-0.5, 0.5),
      70,
      100
    );
    
    // Update status items
    const statusItems = this.elements.statusPanels.container.querySelectorAll('.status-item');
    const values = [
      HUD.state.systemStatus.arcReactorPower,
      HUD.state.systemStatus.systemIntegrity,
      HUD.state.systemStatus.shieldStatus,
      HUD.state.systemStatus.propulsionPower
    ];
    
    statusItems.forEach((item, index) => {
      const value = Math.round(values[index]);
      const color = getStatusColor(value);
      
      // Update value text
      const valueText = item.querySelector('span:last-child');
      valueText.textContent = value + '%';
      valueText.style.color = color;
      
      // Update progress bar
      const progressFill = item.querySelector('div > div');
      progressFill.style.width = value + '%';
      progressFill.style.backgroundColor = color;
      progressFill.style.boxShadow = '0 0 5px ' + color;
    });
  }

  /**
   * Update data visualizations
   */
  updateDataVisualizations() {
    if (!this.elements.dataViz) return;
    
    // Update timeline progress
    const currentProgress = parseFloat(this.elements.dataViz.timelineFill.style.width);
    const newProgress = clamp(currentProgress + randomBetween(-0.1, 0.2), 0, 100);
    this.elements.dataViz.timelineFill.style.width = newProgress + '%';
    
    // Update markers
    const markers = this.elements.dataViz.timeline.querySelectorAll('.timeline-marker');
    markers.forEach((marker, index) => {
      const markerPosition = index * 25;
      if (markerPosition <= newProgress) {
        marker.style.backgroundColor = HUD.config.colors.secondary;
        marker.style.opacity = '1';
      } else {
        marker.style.backgroundColor = HUD.config.colors.primary;
        marker.style.opacity = '0.5';
      }
    });
  }

  /**
   * Show target identification overlay
   * @param {Object} target - Target information
   * @param {Object} position - Position {x, y, width, height}
   */
  showTargetIdentification(target, position) {
    if (!this.elements.targetId) return;
    
    const container = this.elements.targetId.container;
    
    // Position container
    container.style.display = 'block';
    container.style.top = position.y + 'px';
    container.style.left = position.x + 'px';
    container.style.width = position.width + 'px';
    container.style.height = position.height + 'px';
    
    // Update target info
    this.elements.targetId.distance.textContent = target.distance + ' m';
    this.elements.targetId.type.textContent = target.type;
    this.elements.targetId.status.textContent = target.status;
    this.elements.targetId.threat.textContent = target.threat;
    this.elements.targetId.threat.style.color = 
      target.threat === 'HIGH' ? '#ff3030' : 
      target.threat === 'MEDIUM' ? '#ffaa00' : 
      target.threat === 'LOW' ? '#00aa00' : 
      HUD.config.colors.accent;
  }

  /**
   * Hide target identification overlay
   */
  hideTargetIdentification() {
    if (!this.elements.targetId) return;
    this.elements.targetId.container.style.display = 'none';
  }

  /**
   * Activate HUD element
   * @param {string} elementName - Element name
   */
  activateElement(elementName) {
    // Find element by name
    const element = document.querySelector(`[data-activatable="true"][data-name="${elementName}"]`);
    if (!element) return;
    
    // Create activation effect
    const activationEffect = document.createElement('div');
    activationEffect.className = 'activation-effect';
    activationEffect.style.position = 'absolute';
    activationEffect.style.top = '0';
    activationEffect.style.left = '0';
    activationEffect.style.width = '100%';
    activationEffect.style.height = '100%';
    activationEffect.style.backgroundColor = 'rgba(0, 255, 255, 0.2)';
    activationEffect.style.borderRadius = element.style.borderRadius;
    activationEffect.style.animation = 'fade-in 0.3s forwards';
    activationEffect.style.pointerEvents = 'none';
    
    // Add to element
    element.appendChild(activationEffect);
    
    // Create notification based on element
    let title, message;
    switch (elementName) {
      case 'arc-reactor':
        title = 'ARC REACTOR';
        message = 'Power output optimized. Current level: ' + HUD.state.systemStatus.arcReactorPower + '%';
        break;
      case 'radar':
        title = 'PROXIMITY SCAN';
        message = 'Scan radius increased. Detecting additional objects in vicinity.';
        break;
      case 'system-status':
        title = 'SYSTEM DIAGNOSTICS';
        message = 'Running full system diagnostic. All systems nominal.';
        break;
      case 'target-id':
        title = 'TARGET ANALYSIS';
        message = 'Enhanced target data collection activated.';
        break;
      case 'data-visualization':
        title = 'DATA ANALYSIS';
        message = 'Advanced metrics enabled. Processing additional telemetry.';
        break;
      default:
        title = 'SYSTEM ALERT';
        message = 'Element activated: ' + elementName;
    }
    
    createNotification(title, message);
    
    // Play voice feedback if available
    if (hudVoice && hudVoice.initialized) {
      const phrase = hudVoice.getActivationPhrase(elementName);
      hudVoice.speak(phrase);
    }
    
    // Remove effect after animation
    setTimeout(() => {
      if (activationEffect.parentNode) {
        activationEffect.parentNode.removeChild(activationEffect);
      }
    }, 1000);
    
    // Perform element-specific actions
    this.performElementAction(elementName, element);
  }
  
  /**
   * Perform element-specific actions when activated
   * @param {string} elementName - Element name
   * @param {HTMLElement} element - Element DOM node
   */
  performElementAction(elementName, element) {
    switch (elementName) {
      case 'arc-reactor':
        // Boost arc reactor power temporarily
        const originalPower = HUD.state.systemStatus.arcReactorPower;
        HUD.state.systemStatus.arcReactorPower = Math.min(100, originalPower + 15);
        
        // Return to normal after a delay
        setTimeout(() => {
          HUD.state.systemStatus.arcReactorPower = originalPower;
        }, 5000);
        break;
        
      case 'radar':
        // Show target identification for a random blip
        if (hudCanvas && hudCanvas.elements.radarSweep) {
          // Create a simulated target
          const target = {
            type: ['AIRCRAFT', 'VEHICLE', 'PERSONNEL', 'UNKNOWN'][Math.floor(Math.random() * 4)],
            status: ['ACTIVE', 'PASSIVE', 'MOVING', 'STATIONARY'][Math.floor(Math.random() * 4)],
            threat: ['HIGH', 'MEDIUM', 'LOW', 'NONE'][Math.floor(Math.random() * 4)],
            distance: Math.floor(Math.random() * 2000 + 500).toString()
          };
          
          // Random position on screen
          const position = {
            x: window.innerWidth / 2 - 100 + Math.random() * 200,
            y: window.innerHeight / 2 - 100 + Math.random() * 200,
            width: 200,
            height: 200
          };
          
          // Show target identification
          this.showTargetIdentification(target, position);
          
          // Hide after 5 seconds
          setTimeout(() => {
            this.hideTargetIdentification();
          }, 5000);
        }
        break;
        
      case 'system-status':
        // Run a simulated diagnostic
        if (hudEffects) {
          hudEffects.effects.scan.play({
            duration: 3000
          }, () => {
            // Create success notification after scan
            createNotification('DIAGNOSTIC COMPLETE', 'All systems operating within normal parameters.', 5);
            
            // Voice feedback
            if (hudVoice && hudVoice.initialized) {
              hudVoice.speak('Diagnostic complete. All systems functioning at optimal levels.');
            }
          });
        }
        break;
        
      case 'target-id':
        // Simulate target lock on random position
        if (hudEffects) {
          const x = window.innerWidth / 2 - 100 + Math.random() * 200;
          const y = window.innerHeight / 2 - 100 + Math.random() * 200;
          
          hudEffects.effects.targetLock.play({
            duration: 2000,
            x: x,
            y: y
          });
        }
        break;
        
      case 'data-visualization':
        // Simulate data processing
        if (hudEffects) {
          hudEffects.effects.notification.play({
            duration: 1000
          }, () => {
            // Create data notification
            createNotification('DATA ANALYSIS', 'Processing complete. New metrics available.', 5);
            
            // Voice feedback
            if (hudVoice && hudVoice.initialized) {
              hudVoice.speak('Data analysis complete. Performance metrics updated with latest telemetry.');
            }
          });
        }
        break;
    }
  }
}

/**
 * Get color based on status value
 * @param {number} value - Status value (0-100)
 * @returns {string} Color
 */
function getStatusColor(value) {
  if (value >= 80) {
    return '#00ffaa';
  } else if (value >= 60) {
    return '#00ffff';
  } else if (value >= 40) {
    return '#ffaa00';
  } else {
    return '#ff3030';
  }
}
