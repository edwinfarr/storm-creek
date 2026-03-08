// Timer component — countdown and stopwatch modes

export class Timer {
  constructor(container, options = {}) {
    this.container = container;
    this.mode = options.mode || 'stopwatch'; // 'countdown' | 'stopwatch'
    this.targetSeconds = options.targetSeconds || 0;
    this.onComplete = options.onComplete || null;
    this.onTick = options.onTick || null;
    this.elapsed = 0;
    this.interval = null;
    this.running = false;
    this.startTimestamp = null;
    this.render();
  }

  render() {
    this.el = document.createElement('div');
    this.el.className = 'timer-display' + (this.mode === 'countdown' && this.targetSeconds > 0 ? '' : '');
    this.updateDisplay();
    this.container.appendChild(this.el);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.startTimestamp = Date.now() - (this.elapsed * 1000);
    this.interval = setInterval(() => this.tick(), 100);
  }

  tick() {
    this.elapsed = (Date.now() - this.startTimestamp) / 1000;
    this.updateDisplay();

    if (this.onTick) this.onTick(this.elapsed);

    if (this.mode === 'countdown' && this.targetSeconds > 0) {
      const remaining = this.targetSeconds - this.elapsed;
      if (remaining <= 0) {
        this.stop();
        this.elapsed = this.targetSeconds;
        this.updateDisplay();
        if (this.onComplete) this.onComplete();
      }
    }
  }

  stop() {
    this.running = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  reset() {
    this.stop();
    this.elapsed = 0;
    this.startTimestamp = null;
    this.updateDisplay();
  }

  getSeconds() {
    return Math.floor(this.elapsed);
  }

  getDisplaySeconds() {
    if (this.mode === 'countdown' && this.targetSeconds > 0) {
      return Math.max(0, Math.ceil(this.targetSeconds - this.elapsed));
    }
    return Math.floor(this.elapsed);
  }

  updateDisplay() {
    const secs = this.getDisplaySeconds();
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    this.el.textContent = `${min}:${sec.toString().padStart(2, '0')}`;

    // Color change for countdown last 5 seconds
    if (this.mode === 'countdown' && this.targetSeconds > 0) {
      const remaining = this.targetSeconds - this.elapsed;
      if (remaining <= 5 && remaining > 0) {
        this.el.style.color = 'var(--accent-ember)';
      } else if (remaining <= 0) {
        this.el.style.color = 'var(--success)';
      }
    }
  }

  destroy() {
    this.stop();
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }
}
