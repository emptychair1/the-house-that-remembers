/* Foreword Choreographer v0.1
   Foundation only. No visual behavior is registered in Bite 1.
   The protected v1.26s choreography remains authoritative until each cue is migrated and verified.
*/
(function (global) {
  'use strict';

  const state = {
    running: false,
    startedAt: 0,
    timers: new Set()
  };

  function later(fn, delayMs) {
    const id = setTimeout(() => {
      state.timers.delete(id);
      if (state.running) fn();
    }, Math.max(0, delayMs));
    state.timers.add(id);
    return id;
  }

  function stop() {
    state.running = false;
    state.timers.forEach(clearTimeout);
    state.timers.clear();
  }

  function start(cues) {
    stop();
    state.running = true;
    state.startedAt = performance.now();
    (cues || []).forEach(cue => {
      if (!cue || typeof cue.run !== 'function') return;
      later(cue.run, Number(cue.at) || 0);
    });
  }

  global.ForewordChoreographer = Object.freeze({ start, stop });
})(window);
