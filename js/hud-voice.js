/**
 * Voice feedback for Iron Man HUD Interface
 */

class HUDVoice {
  constructor() {
    this.voices = [];
    this.selectedVoice = null;
    this.speaking = false;
    this.queue = [];
    this.initialized = false;
    this.volume = 0.8;
    this.rate = 1.0;
    this.pitch = 1.0;
  }

  /**
   * Initialize voice synthesis
   */
  init() {
    if (typeof window.speechSynthesis === 'undefined') {
      console.warn('Speech synthesis not supported in this browser');
      return false;
    }

    // Get available voices
    this.loadVoices();

    // Set up voice change event
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }

    this.initialized = true;
    return true;
  }

  /**
   * Load available voices
   */
  loadVoices() {
    this.voices = speechSynthesis.getVoices();
    
    // Try to find a good voice for JARVIS
    let preferredVoice = this.voices.find(voice => 
      voice.name.includes('Daniel') || 
      voice.name.includes('British') || 
      voice.name.includes('UK English Male')
    );
    
    // Fallback to any male voice
    if (!preferredVoice) {
      preferredVoice = this.voices.find(voice => 
        voice.name.includes('Male') || 
        voice.name.includes('David') || 
        voice.name.includes('Google UK English Male')
      );
    }
    
    // Fallback to any English voice
    if (!preferredVoice) {
      preferredVoice = this.voices.find(voice => 
        voice.lang.includes('en-')
      );
    }
    
    // Final fallback to any voice
    this.selectedVoice = preferredVoice || (this.voices.length > 0 ? this.voices[0] : null);
  }

  /**
   * Speak text
   * @param {string} text - Text to speak
   * @param {Function} callback - Callback after speaking
   */
  speak(text, callback) {
    if (!this.initialized || !this.selectedVoice) {
      if (callback) callback();
      return;
    }

    // Add to queue if already speaking
    if (this.speaking) {
      this.queue.push({ text, callback });
      return;
    }

    this.speaking = true;

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.selectedVoice;
    utterance.volume = this.volume;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    // Set up events
    utterance.onend = () => {
      this.speaking = false;
      
      if (callback) callback();
      
      // Process queue
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        this.speak(next.text, next.callback);
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.speaking = false;
      
      if (callback) callback();
      
      // Process queue
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        this.speak(next.text, next.callback);
      }
    };

    // Speak
    speechSynthesis.speak(utterance);
  }

  /**
   * Cancel all speech
   */
  cancel() {
    if (!this.initialized) return;
    
    speechSynthesis.cancel();
    this.speaking = false;
    this.queue = [];
  }

  /**
   * Set voice parameters
   * @param {Object} params - Voice parameters
   */
  setParams(params = {}) {
    if (params.volume !== undefined) this.volume = params.volume;
    if (params.rate !== undefined) this.rate = params.rate;
    if (params.pitch !== undefined) this.pitch = params.pitch;
  }

  /**
   * Get random activation phrase
   * @param {string} elementName - Element name
   * @returns {string} Activation phrase
   */
  getActivationPhrase(elementName) {
    const phrases = {
      'arc-reactor': [
        'Arc reactor power optimized.',
        'Adjusting power distribution.',
        'Energy levels stabilized.'
      ],
      'radar': [
        'Enhancing proximity scan.',
        'Radar sensitivity increased.',
        'Scanning for nearby objects.'
      ],
      'system-status': [
        'Running system diagnostics.',
        'All systems nominal.',
        'Status check complete.'
      ],
      'target-id': [
        'Target identified.',
        'Analyzing target parameters.',
        'Target lock established.'
      ],
      'data-visualization': [
        'Analyzing performance metrics.',
        'Processing telemetry data.',
        'Data visualization enhanced.'
      ],
      'default': [
        'Command acknowledged.',
        'Function activated.',
        'Processing request.'
      ]
    };

    const options = phrases[elementName] || phrases.default;
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Get random notification phrase
   * @param {string} type - Notification type
   * @returns {string} Notification phrase
   */
  getNotificationPhrase(type) {
    const phrases = {
      'warning': [
        'Warning: Potential threat detected.',
        'Caution advised. Anomaly detected.',
        'Alert: System irregularity identified.'
      ],
      'info': [
        'Information update available.',
        'New data received.',
        'System notification received.'
      ],
      'success': [
        'Operation completed successfully.',
        'Task execution successful.',
        'Procedure completed as requested.'
      ],
      'default': [
        'Notification received.',
        'Alert registered.',
        'Message received.'
      ]
    };

    const options = phrases[type] || phrases.default;
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Get random greeting phrase
   * @returns {string} Greeting phrase
   */
  getGreetingPhrase() {
    const phrases = [
      'JARVIS online. All systems operational.',
      'Good day. Iron Man interface activated.',
      'Interface initialized. Ready for input.',
      'Welcome back. Systems online and ready.'
    ];

    return phrases[Math.floor(Math.random() * phrases.length)];
  }
}
