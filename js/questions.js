(function () {
  'use strict';

  var objects = ['🍎', '🍓', '⭐', '🟡', '🍪', '🌸'];
  var chants = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
  var products = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十', '三十一', '三十二', '三十三', '三十四', '三十五', '三十六', '三十七', '三十八', '三十九', '四十', '四十一', '四十二', '四十三', '四十四', '四十五', '四十六', '四十七', '四十八', '四十九', '五十', '五十一', '五十二', '五十三', '五十四', '五十五', '五十六', '五十七', '五十八', '五十九', '六十', '六十一', '六十二', '六十三', '六十四', '六十五', '六十六', '六十七', '六十八', '六十九', '七十', '七十一', '七十二', '七十三', '七十四', '七十五', '七十六', '七十七', '七十八', '七十九', '八十', '八十一'];

  function rand(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function cnNumber(n) {
    return products[n - 1] || String(n);
  }

  function chant(a, b) {
    var x = Math.min(a, b);
    var y = Math.max(a, b);
    return chants[x - 1] + chants[y - 1] + cnNumber(x * y);
  }

  function makeOptions(answer, max) {
    var set = {};
    set[String(answer)] = true;
    while (Object.keys(set).length < 4) {
      var delta = rand([-12, -9, -6, -4, -3, -2, 2, 3, 4, 5, 6, 8, 9, 12]);
      var next = answer + delta;
      if (next > 0 && next <= max) set[String(next)] = true;
      if (Object.keys(set).length < 4) {
        set[String(randInt(1, 9) * randInt(1, 9))] = true;
      }
    }
    var values = Object.keys(set).map(function (n) { return Number(n); });
    if (values.indexOf(answer) === -1) values[0] = answer;
    return shuffle(values).slice(0, 4);
  }

  function repeatedAddition(a, b) {
    var list = [];
    for (var i = 0; i < a; i++) list.push(String(b));
    return list.join(' + ');
  }

  function visualRows(a, b, icon) {
    var rows = [];
    for (var i = 0; i < a; i++) rows.push(icon.repeat(b));
    return rows;
  }

  function basePair(level) {
    var a = rand(level.numbers);
    var b = randInt(1, 9);
    return { a: a, b: b };
  }

  function makeQuestion(level, index, progress) {
    var pair = basePair(level);
    var a = pair.a;
    var b = pair.b;
    var answer = a * b;
    var typePool = level.id === 'boss'
      ? ['visual', 'choice', 'chant', 'missing', 'factor']
      : ['visual', 'choice', 'chant', 'choice', 'missing'];
    var type = typePool[index % typePool.length];
    var icon = rand(objects);

    if (type === 'visual') {
      return {
        id: 'visual-' + a + '-' + b + '-' + Date.now() + '-' + index,
        type: type,
        a: a,
        b: b,
        answer: answer,
        title: a + ' 组，每组 ' + b + ' 个，一共有几个？',
        subtitle: a + ' × ' + b + ' 表示 ' + a + ' 个 ' + b + ' 相加。',
        options: makeOptions(answer, 81),
        visual: visualRows(a, Math.min(b, 9), icon),
        explanation: a + ' × ' + b + ' = ' + repeatedAddition(a, b) + ' = ' + answer + '。'
      };
    }

    if (type === 'chant') {
      return {
        id: 'chant-' + a + '-' + b + '-' + Date.now() + '-' + index,
        type: type,
        a: a,
        b: b,
        answer: answer,
        title: '口诀补空：' + chants[Math.min(a, b) - 1] + chants[Math.max(a, b) - 1] + '（ ？ ）',
        subtitle: '想一想 ' + Math.min(a, b) + ' × ' + Math.max(a, b) + ' 的口诀。',
        options: makeOptions(answer, 81),
        visual: [],
        explanation: '这句口诀是“' + chant(a, b) + '”，所以答案是 ' + answer + '。'
      };
    }

    if (type === 'missing') {
      return {
        id: 'missing-' + a + '-' + b + '-' + Date.now() + '-' + index,
        type: type,
        a: a,
        b: b,
        answer: b,
        title: a + ' × ？ = ' + answer,
        subtitle: '找一找：几个 ' + a + ' 可以得到 ' + answer + '？',
        options: makeOptions(b, 9),
        visual: [],
        explanation: a + ' × ' + b + ' = ' + answer + '，所以空里填 ' + b + '。'
      };
    }

    if (type === 'factor') {
      var formula = String(a) + '×' + String(b);
      var options = [formula];
      while (options.length < 4) {
        var x = randInt(2, 9);
        var y = randInt(1, 9);
        var item = String(x) + '×' + String(y);
        if (x * y !== answer && options.indexOf(item) === -1) options.push(item);
      }
      return {
        id: 'factor-' + a + '-' + b + '-' + Date.now() + '-' + index,
        type: type,
        a: a,
        b: b,
        answer: formula,
        title: answer + ' 可以由哪两个数相乘得到？',
        subtitle: '找朋友题：选出正确的乘法算式。',
        options: shuffle(options),
        visual: [],
        explanation: a + ' × ' + b + ' = ' + answer + '。'
      };
    }

    return {
      id: 'choice-' + a + '-' + b + '-' + Date.now() + '-' + index,
      type: 'choice',
      a: a,
      b: b,
      answer: answer,
      title: a + ' × ' + b + ' = ？',
      subtitle: '可以用口诀“' + chant(a, b) + '”来帮助记忆。',
      options: makeOptions(answer, 81),
      visual: [],
      explanation: '口诀是“' + chant(a, b) + '”，所以 ' + a + ' × ' + b + ' = ' + answer + '。'
    };
  }

  function makeRound(level, progress) {
    var questions = [];
    for (var i = 0; i < window.JJ_CONFIG.roundSize; i++) {
      questions.push(makeQuestion(level, i, progress));
    }
    return questions;
  }

  function lessonExample(level) {
    var a = level.numbers[0] || 2;
    var b = level.id === 'times-5' ? 4 : 3;
    if (level.id === 'times-6-9' || level.id === 'boss') { a = 6; b = 4; }
    return {
      a: a,
      b: b,
      answer: a * b,
      icon: '⭐',
      rows: visualRows(a, b, '⭐'),
      chant: chant(a, b),
      addition: repeatedAddition(a, b)
    };
  }

  window.JJQuestions = { makeRound: makeRound, lessonExample: lessonExample, chant: chant };
}());
