// Rep counter component — big tap targets for mid-workout use

export class RepCounter {
  constructor(container, options = {}) {
    this.container = container;
    this.count = options.initial || 0;
    this.target = options.target || 0;
    this.onChange = options.onChange || null;
    this.render();
  }

  render() {
    this.el = document.createElement('div');
    this.el.className = 'rep-counter';

    this.minusBtn = document.createElement('button');
    this.minusBtn.className = 'btn-icon';
    this.minusBtn.textContent = '\u2212';
    this.minusBtn.addEventListener('click', () => this.decrement());

    this.display = document.createElement('div');
    this.display.className = 'rep-count';
    this.updateDisplay();

    this.plusBtn = document.createElement('button');
    this.plusBtn.className = 'btn-icon';
    this.plusBtn.textContent = '+';
    this.plusBtn.addEventListener('click', () => this.increment());

    this.el.appendChild(this.minusBtn);
    this.el.appendChild(this.display);
    this.el.appendChild(this.plusBtn);
    this.container.appendChild(this.el);
  }

  increment() {
    this.count++;
    this.updateDisplay();
    if (this.onChange) this.onChange(this.count);
  }

  decrement() {
    if (this.count > 0) {
      this.count--;
      this.updateDisplay();
      if (this.onChange) this.onChange(this.count);
    }
  }

  getCount() {
    return this.count;
  }

  updateDisplay() {
    this.display.textContent = this.count;
    if (this.target > 0 && this.count >= this.target) {
      this.display.style.color = 'var(--success)';
    } else {
      this.display.style.color = 'var(--accent-bone)';
    }
  }

  destroy() {
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  }
}
