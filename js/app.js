(function () {
  'use strict';

  var levels = window.JJ_LEVELS;
  var progress = window.JJStorage.load();
  var currentLevel = levels[0];
  var round = [];
  var roundIndex = 0;
  var roundCorrect = 0;
  var answered = false;
  var rescueIndex = null;

  function getLevel(id) {
    return levels.find(function (level) { return level.id === id; }) || levels[0];
  }

  function saveAndRender() {
    window.JJStorage.save(progress);
    window.JJUI.renderSummary(progress);
    window.JJUI.renderLevels(levels, progress, { onLearn: openLesson, onPlay: startLevel });
    window.JJUI.renderRescue(progress, { onRescue: startRescue });
    window.JJUI.renderBadges(progress, levels);
  }

  function openLesson(levelId) {
    currentLevel = getLevel(levelId || progress.lastLevel);
    progress.lastLevel = currentLevel.id;
    var example = window.JJQuestions.lessonExample(currentLevel);
    window.JJUI.renderLesson(currentLevel, example);
    window.JJUI.setView('learn');
    window.JJStorage.save(progress);
  }

  function startLevel(levelId) {
    currentLevel = getLevel(levelId || progress.lastLevel);
    if (!window.JJRewards.isLevelUnlocked(progress, currentLevel)) return;
    rescueIndex = null;
    progress.lastLevel = currentLevel.id;
    round = window.JJQuestions.makeRound(currentLevel, progress);
    roundIndex = 0;
    roundCorrect = 0;
    answered = false;
    window.JJUI.setPlayLevelName(currentLevel.emoji + ' ' + currentLevel.title);
    window.JJUI.setRoundStars(0);
    window.JJUI.$('#nextQuestionBtn').textContent = '下一题';
    window.JJUI.setView('play');
    renderCurrentQuestion();
    window.JJStorage.save(progress);
  }

  function startRescue(index) {
    var wrong = progress.wrongs[index];
    if (!wrong) return;
    rescueIndex = index;
    currentLevel = getLevel(wrong.levelId || progress.lastLevel);
    round = [{
      id: wrong.id || ('rescue-' + index),
      type: wrong.type,
      a: wrong.a,
      b: wrong.b,
      answer: wrong.answer,
      title: wrong.title,
      subtitle: wrong.subtitle || '这是一道错题救援题，答对可以帮助星星回家。',
      options: wrong.options,
      visual: wrong.visual || [],
      explanation: wrong.explanation
    }];
    roundIndex = 0;
    roundCorrect = 0;
    answered = false;
    window.JJUI.setPlayLevelName('⭐ 错题救援站');
    window.JJUI.setRoundStars(0);
    window.JJUI.$('#nextQuestionBtn').textContent = '完成救援';
    window.JJUI.setView('play');
    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    var question = round[roundIndex];
    window.JJUI.renderQuestion(question, roundIndex, round.length, answered);
    window.JJUI.$all('.choice').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!answered) chooseAnswer(btn.dataset.answer);
      });
    });
  }

  function rememberWrong(question) {
    var key = [question.type, question.a, question.b, question.title].join('|');
    var existing = progress.wrongs.find(function (item) { return item.key === key; });
    if (existing) {
      existing.missed = (existing.missed || 1) + 1;
      existing.rescued = 0;
      return;
    }
    progress.wrongs.unshift({
      key: key,
      id: question.id,
      levelId: currentLevel.id,
      type: question.type,
      a: question.a,
      b: question.b,
      answer: question.answer,
      title: question.title,
      subtitle: question.subtitle,
      options: question.options,
      visual: question.visual,
      explanation: question.explanation,
      missed: 1,
      rescued: 0
    });
    progress.wrongs = progress.wrongs.slice(0, window.JJ_CONFIG.maxWrongItems);
  }

  function chooseAnswer(value) {
    var question = round[roundIndex];
    var correct = String(value) === String(question.answer);
    answered = true;
    progress.stats.answered += 1;
    if (correct) {
      roundCorrect += 1;
      progress.stats.correct += 1;
      progress.stats.streak += 1;
      progress.stats.bestStreak = Math.max(progress.stats.bestStreak || 0, progress.stats.streak);
      if (rescueIndex !== null && progress.wrongs[rescueIndex]) {
        progress.wrongs[rescueIndex].rescued = (progress.wrongs[rescueIndex].rescued || 0) + 1;
      }
    } else {
      progress.stats.streak = 0;
      rememberWrong(question);
    }
    window.JJUI.markChoices(question.answer, value);
    window.JJUI.showFeedback(correct, question);
    window.JJStorage.save(progress);
    saveAndRender();
  }

  function nextQuestion() {
    if (!round.length) return;
    if (!answered) return;

    if (rescueIndex !== null) {
      finishRescue();
      return;
    }

    roundIndex += 1;
    answered = false;
    if (roundIndex >= round.length) finishRound();
    else renderCurrentQuestion();
  }

  function finishRound() {
    var stars = window.JJRewards.starsForRound(roundCorrect, round.length);
    var reward = window.JJRewards.applyLevelReward(progress, currentLevel, stars);
    var result = { correct: roundCorrect, total: round.length, stars: stars };
    window.JJUI.setRoundStars(stars);
    window.JJUI.renderRoundEnd(currentLevel, result, reward);
    answered = true;
    round = [];
    window.JJStorage.save(progress);
    saveAndRender();
  }

  function finishRescue() {
    var item = progress.wrongs[rescueIndex];
    if (item && (item.rescued || 0) >= window.JJ_CONFIG.rescueMasteryTarget) {
      progress.wrongs.splice(rescueIndex, 1);
    }
    rescueIndex = null;
    window.JJStorage.save(progress);
    saveAndRender();
    window.JJUI.setView('rescue');
  }

  function clearRescued() {
    progress.wrongs = progress.wrongs.filter(function (item) {
      return (item.rescued || 0) < window.JJ_CONFIG.rescueMasteryTarget;
    });
    window.JJStorage.save(progress);
    saveAndRender();
  }

  function bindStaticEvents() {
    window.JJUI.$all('.tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var view = tab.dataset.view;
        if (view === 'learn') openLesson(progress.lastLevel);
        else window.JJUI.setView(view);
      });
    });

    window.JJUI.$('[data-action="go-map"]').addEventListener('click', function () { window.JJUI.setView('map'); });
    window.JJUI.$('[data-action="go-rescue"]').addEventListener('click', function () { window.JJUI.setView('rescue'); });
    window.JJUI.$('[data-action="back-map"]').addEventListener('click', function () { window.JJUI.setView('map'); });
    window.JJUI.$('[data-action="clear-rescued"]').addEventListener('click', clearRescued);
    window.JJUI.$('#nextQuestionBtn').addEventListener('click', function () {
      if (!round.length) window.JJUI.setView('map');
      else nextQuestion();
    });

    document.addEventListener('click', function (event) {
      var target = event.target.closest('[data-action="lesson-play"]');
      if (target) startLevel(target.dataset.level);
    });
  }

  function init() {
    bindStaticEvents();
    saveAndRender();
    openLesson(progress.lastLevel || 'times-2');
    window.JJUI.setView('map');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
