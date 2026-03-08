// Settings screen — station editor, data export/import, preferences

import { store } from '../models/store.js';
import { defaultStations, defaultTransitTimes, stationPresets, getPresetNames } from '../data/stations.js';
import { requestNotificationPermission } from '../utils/notifications.js';

export function renderSettings(container) {
  const settings = store.getSettings();
  const calledConfig = store.getCalledConfig();

  container.innerHTML = `
    <div class="screen">
      <h1>SETTINGS</h1>

      <div class="card mt-16">
        <h3>SOUND</h3>
        <div class="setting-row">
          <span class="setting-label">Timer Beeps & Transitions</span>
          <label class="toggle">
            <input type="checkbox" id="toggle-sound" ${settings.soundEnabled ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div class="card">
        <h3>CALLED EXERCISES</h3>
        <div class="setting-row">
          <span class="setting-label">Enabled</span>
          <label class="toggle">
            <input type="checkbox" id="toggle-called" ${calledConfig.enabled ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-row">
          <span class="setting-label">Min Interval (min)</span>
          <input type="number" id="called-min" value="${calledConfig.minIntervalMin}" style="width: 80px; text-align: center;">
        </div>
        <div class="setting-row">
          <span class="setting-label">Max Interval (min)</span>
          <input type="number" id="called-max" value="${calledConfig.maxIntervalMin}" style="width: 80px; text-align: center;">
        </div>
        <div class="setting-row">
          <span class="setting-label">Active Hours</span>
          <span class="setting-value">${calledConfig.activeStartHour}:00 - ${calledConfig.activeEndHour}:00</span>
        </div>
        <button class="btn btn-secondary btn-small mt-8" id="btn-notify-perm" style="width: 100%;">
          Enable Notifications
        </button>
        <div class="setting-row mt-8" style="flex-direction: column; align-items: stretch; gap: 8px;">
          <span class="setting-label">Custom Alert Sound</span>
          <p class="text-dim" style="font-size: 12px;">Download this file, then set it as your notification sound in Android Settings &gt; Sound &gt; Notification sound.</p>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-small" id="btn-preview-sound" style="flex: 0 0 auto;">Preview</button>
            <a href="./audio/storm-creek-alert.wav" download="storm-creek-alert.wav"
               class="btn btn-secondary btn-small" style="flex: 1; text-decoration: none; text-align: center;">
              Download .wav
            </a>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>STATIONS</h3>
        <p class="text-dim mb-16" style="font-size: 13px;">Load a preset for your location, or customize individually</p>
        <div style="margin-bottom: 16px;">
          <select id="station-preset" style="width: 100%;">
            <option value="">-- Select a Preset --</option>
            ${getPresetNames().map(p => `<option value="${p.id}">${p.name} \u2014 ${p.description}</option>`).join('')}
          </select>
          <button class="btn btn-secondary btn-small mt-8" id="btn-apply-preset" style="width: 100%;">
            Apply Preset
          </button>
        </div>
        <div style="border-top: 1px solid #2a2a2a; padding-top: 12px;">
          ${renderStationList(settings)}
        </div>
      </div>

      <div class="card">
        <h3>DATA</h3>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-small" id="btn-export" style="flex: 1;">Export JSON</button>
          <button class="btn btn-secondary btn-small" id="btn-import" style="flex: 1;">Import JSON</button>
        </div>
        <input type="file" id="import-file" accept=".json" style="display: none;">

        <div class="setting-row mt-16" style="border-top: 1px solid #2a2a2a; padding-top: 16px;">
          <span class="setting-label" style="color: var(--danger);">Clear All Data</span>
          <button class="btn btn-small" id="btn-clear"
                  style="background: var(--danger); color: #fff; min-height: 40px; padding: 8px 16px;">
            CLEAR
          </button>
        </div>
      </div>

      <div class="card">
        <h3>ABOUT</h3>
        <p class="text-dim" style="font-size: 13px; line-height: 1.6;">
          Storm Creek Outdoor Workout Tracker<br>
          50 acres \u2022 Caswell County, NC<br>
          Built for the property. No backend. All local.<br>
          <br>
          3-week periodization: build, build, deload<br>
          Rotation: Ridge Run \u2192 Dark Water \u2192 Ridge Run \u2192 Storm Fire
        </p>
      </div>
    </div>
  `;

  bindSettingsEvents(container, settings, calledConfig);
}

function renderStationList(settings) {
  return Object.values(defaultStations).map(station => {
    const override = (settings.stationOverrides || {})[station.id] || {};
    const name = override.name || station.name;
    const desc = override.description || station.description;
    return `
      <div class="setting-row" style="flex-direction: column; align-items: stretch; gap: 8px;">
        <div class="flex-between">
          <span style="font-size: 18px;">${station.icon}</span>
          <span style="font-weight: 600;">${name}</span>
        </div>
        <div class="text-dim" style="font-size: 13px;">${desc}</div>
      </div>
    `;
  }).join('');
}

function bindSettingsEvents(container, settings, calledConfig) {
  // Sound toggle
  container.querySelector('#toggle-sound').addEventListener('change', (e) => {
    settings.soundEnabled = e.target.checked;
    store.saveSettings(settings);
  });

  // Called exercise toggle
  container.querySelector('#toggle-called').addEventListener('change', (e) => {
    calledConfig.enabled = e.target.checked;
    store.set('calledConfig', calledConfig);
  });

  // Called interval inputs
  container.querySelector('#called-min').addEventListener('change', (e) => {
    calledConfig.minIntervalMin = parseInt(e.target.value) || 90;
    store.set('calledConfig', calledConfig);
  });

  container.querySelector('#called-max').addEventListener('change', (e) => {
    calledConfig.maxIntervalMin = parseInt(e.target.value) || 180;
    store.set('calledConfig', calledConfig);
  });

  // Notification permission
  container.querySelector('#btn-notify-perm').addEventListener('click', () => {
    requestNotificationPermission();
  });

  // Station preset
  container.querySelector('#btn-apply-preset').addEventListener('click', () => {
    const select = container.querySelector('#station-preset');
    const presetId = select.value;
    if (!presetId) return;
    const preset = stationPresets[presetId];
    if (!preset) return;
    if (confirm(`Apply "${preset.name}" station layout? This will replace your current station names.`)) {
      settings.stationOverrides = {};
      // Save overrides as the preset stations
      for (const [id, station] of Object.entries(preset.stations)) {
        settings.stationOverrides[id] = { name: station.name, description: station.description };
      }
      settings.transitOverrides = preset.transitTimes;
      settings.activePreset = presetId;
      store.saveSettings(settings);
      renderSettings(container);
    }
  });

  // Preview alert sound
  container.querySelector('#btn-preview-sound').addEventListener('click', () => {
    const a = new Audio('./audio/storm-creek-alert.wav');
    a.play().catch(() => {});
  });

  // Export
  container.querySelector('#btn-export').addEventListener('click', () => {
    const data = store.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storm-creek-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import
  const fileInput = container.querySelector('#import-file');
  container.querySelector('#btn-import').addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (confirm(`Import ${(data.workoutLogs || []).length} workouts? This will merge with existing data.`)) {
          store.importData(data);
          renderSettings(container);
        }
      } catch {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  });

  // Clear all data
  container.querySelector('#btn-clear').addEventListener('click', () => {
    if (confirm('Delete ALL workout data? This cannot be undone.')) {
      if (confirm('Are you sure? Everything will be gone.')) {
        localStorage.clear();
        renderSettings(container);
      }
    }
  });
}
