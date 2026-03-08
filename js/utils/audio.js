// Audio feedback — generated tones using Web Audio API (no external files needed)

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.3) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available — silent fail
  }
}

export const audio = {
  // Countdown beep (last 3 seconds)
  beep() {
    playTone(880, 0.1, 'sine', 0.2);
  },

  // Final countdown beep (longer, higher)
  beepFinal() {
    playTone(1200, 0.3, 'sine', 0.4);
  },

  // Station transition horn
  horn() {
    playTone(220, 0.15, 'sawtooth', 0.2);
    setTimeout(() => playTone(330, 0.3, 'sawtooth', 0.25), 150);
  },

  // Workout complete
  complete() {
    playTone(440, 0.15, 'sine', 0.3);
    setTimeout(() => playTone(554, 0.15, 'sine', 0.3), 150);
    setTimeout(() => playTone(659, 0.3, 'sine', 0.35), 300);
  },

  // Rep tap feedback
  tap() {
    playTone(600, 0.05, 'sine', 0.1);
  },

  // PR achieved
  pr() {
    playTone(523, 0.1, 'sine', 0.3);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.3), 100);
    setTimeout(() => playTone(784, 0.1, 'sine', 0.3), 200);
    setTimeout(() => playTone(1047, 0.3, 'sine', 0.4), 300);
  }
};
