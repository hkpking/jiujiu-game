(function () {
  'use strict';

  var KEY = 'jiujiu-game-v2-progress';
  var defaults = {
    stars: {},
    badges: [],
    stickers: [],
    wrongs: [],
    stats: { answered: 0, correct: 0, streak: 0, bestStreak: 0 },
    lastLevel: 'times-2'
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function mergeDefaults(data) {
    var base = clone(defaults);
    if (!data || typeof data !== 'object') return base;
    base.stars = data.stars || {};
    base.badges = Array.isArray(data.badges) ? data.badges : [];
    base.stickers = Array.isArray(data.stickers) ? data.stickers : [];
    base.wrongs = Array.isArray(data.wrongs) ? data.wrongs : [];
    base.stats = Object.assign(base.stats, data.stats || {});
    base.lastLevel = data.lastLevel || base.lastLevel;
    return base;
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return mergeDefaults(raw ? JSON.parse(raw) : null);
    } catch (error) {
      return mergeDefaults(null);
    }
  }

  function save(progress) {
    try {
      localStorage.setItem(KEY, JSON.stringify(progress));
    } catch (error) {
      // 部分内置浏览器或隐私模式可能禁用 localStorage，游戏仍可继续运行。
    }
  }

  function reset() {
    var data = mergeDefaults(null);
    save(data);
    return data;
  }

  window.JJStorage = { load: load, save: save, reset: reset };
}());
