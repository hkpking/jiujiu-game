(function () {
  'use strict';

  function totalStars(progress) {
    return Object.keys(progress.stars || {}).reduce(function (sum, key) {
      return sum + (progress.stars[key] || 0);
    }, 0);
  }

  function starsForRound(correct, total) {
    if (correct >= total) return 3;
    if (correct >= Math.ceil(total * 0.75)) return 2;
    if (correct >= Math.ceil(total * 0.5)) return 1;
    return 0;
  }

  function applyLevelReward(progress, level, stars) {
    var previous = progress.stars[level.id] || 0;
    var improved = stars > previous;
    if (improved) progress.stars[level.id] = stars;

    var unlocked = [];
    if (stars >= 2 && progress.badges.indexOf(level.badge) === -1) {
      progress.badges.push(level.badge);
      unlocked.push('徽章：' + level.badge);
    }
    if (stars >= 1 && progress.stickers.indexOf(level.sticker) === -1) {
      progress.stickers.push(level.sticker);
      unlocked.push('贴纸：' + level.sticker);
    }
    return { improved: improved, unlocked: unlocked };
  }

  function isLevelUnlocked(progress, level) {
    return totalStars(progress) >= level.unlockStars;
  }

  function starText(count) {
    var filled = '⭐'.repeat(count);
    var empty = '☆'.repeat(Math.max(0, 3 - count));
    return filled + empty;
  }

  window.JJRewards = { totalStars: totalStars, starsForRound: starsForRound, applyLevelReward: applyLevelReward, isLevelUnlocked: isLevelUnlocked, starText: starText };
}());
