(function () {
  'use strict';

  window.JJ_LEVELS = [
    {
      id: 'times-2',
      order: 1,
      title: '2 的口诀村',
      emoji: '🌱',
      numbers: [2],
      focus: '理解 2 个 2、3 个 2、4 个 2 的规律',
      goal: '掌握 2 的乘法口诀',
      unlockStars: 0,
      sticker: '小树苗贴纸',
      badge: '2 的口诀小园丁'
    },
    {
      id: 'times-3',
      order: 2,
      title: '3 的口诀森林',
      emoji: '🌳',
      numbers: [3],
      focus: '用 3 个一组认识乘法',
      goal: '掌握 3 的乘法口诀',
      unlockStars: 3,
      sticker: '森林小鹿贴纸',
      badge: '3 的口诀探险家'
    },
    {
      id: 'times-4',
      order: 3,
      title: '4 的口诀山谷',
      emoji: '⛰️',
      numbers: [4],
      focus: '把 4 的口诀和重复加法联系起来',
      goal: '掌握 4 的乘法口诀',
      unlockStars: 6,
      sticker: '山谷风车贴纸',
      badge: '4 的口诀攀登者'
    },
    {
      id: 'times-5',
      order: 4,
      title: '5 的口诀城堡',
      emoji: '🏰',
      numbers: [5],
      focus: '发现 5 的口诀个位规律',
      goal: '掌握 5 的乘法口诀',
      unlockStars: 9,
      sticker: '城堡钥匙贴纸',
      badge: '5 的口诀守护者'
    },
    {
      id: 'times-6-9',
      order: 5,
      title: '6～9 挑战星球',
      emoji: '🪐',
      numbers: [6, 7, 8, 9],
      focus: '综合练习高阶口诀',
      goal: '熟悉 6、7、8、9 的乘法口诀',
      unlockStars: 12,
      sticker: '星球光环贴纸',
      badge: '高阶口诀航行员'
    },
    {
      id: 'boss',
      order: 6,
      title: '混合 Boss 关',
      emoji: '🐲',
      numbers: [2, 3, 4, 5, 6, 7, 8, 9],
      focus: '混合题、缺数题和错题回顾',
      goal: '综合应用九九乘法口诀',
      unlockStars: 15,
      sticker: '火箭徽章贴纸',
      badge: '乘法星球勇士'
    }
  ];

  window.JJ_CONFIG = {
    roundSize: 6,
    rescueMasteryTarget: 2,
    maxWrongItems: 30
  };
}());
