(function () {
  'use strict';

  function $(selector) { return document.querySelector(selector); }
  function $all(selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
    });
  }

  function setView(name) {
    $all('.view').forEach(function (view) { view.classList.remove('is-active'); });
    $all('.tab').forEach(function (tab) { tab.classList.remove('is-active'); });
    var view = $('#view-' + name);
    if (view) view.classList.add('is-active');
    var tab = $('.tab[data-view="' + name + '"]');
    if (tab) tab.classList.add('is-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderSummary(progress) {
    var total = window.JJRewards.totalStars(progress);
    var accuracy = progress.stats.answered ? Math.round(progress.stats.correct / progress.stats.answered * 100) : 0;
    $('#summaryGrid').innerHTML = [
      '<div class="summary-card"><b>' + total + '</b><span>已获星星</span></div>',
      '<div class="summary-card"><b>' + progress.badges.length + '</b><span>已得徽章</span></div>',
      '<div class="summary-card"><b>' + progress.wrongs.length + '</b><span>待救援错题</span></div>',
      '<div class="summary-card"><b>' + accuracy + '%</b><span>总正确率</span></div>'
    ].join('');
  }

  function renderLevels(levels, progress, handlers) {
    var html = levels.map(function (level) {
      var unlocked = window.JJRewards.isLevelUnlocked(progress, level);
      var stars = progress.stars[level.id] || 0;
      return '<article class="level-card ' + (unlocked ? '' : 'is-locked') + '" data-emoji="' + level.emoji + '">' +
        '<h3>' + level.emoji + ' ' + escapeHtml(level.title) + '</h3>' +
        '<p>' + escapeHtml(level.goal) + '</p>' +
        '<div class="level-meta">' +
          '<span class="chip">' + window.JJRewards.starText(stars) + '</span>' +
          '<span class="chip">解锁：' + level.unlockStars + ' 星</span>' +
        '</div>' +
        '<p><b>学习重点：</b>' + escapeHtml(level.focus) + '</p>' +
        '<div class="level-actions">' +
          '<button class="btn btn-warm btn-small" type="button" data-learn="' + level.id + '" ' + (unlocked ? '' : 'disabled') + '>先学一学</button>' +
          '<button class="btn btn-primary btn-small" type="button" data-play="' + level.id + '" ' + (unlocked ? '' : 'disabled') + '>开始闯关</button>' +
        '</div>' +
      '</article>';
    }).join('');
    $('#levelGrid').innerHTML = html;
    $all('[data-learn]').forEach(function (btn) { btn.addEventListener('click', function () { handlers.onLearn(btn.dataset.learn); }); });
    $all('[data-play]').forEach(function (btn) { btn.addEventListener('click', function () { handlers.onPlay(btn.dataset.play); }); });
  }

  function renderLesson(level, example) {
    $('#lessonCard').innerHTML = '<div class="lesson-layout">' +
      '<div class="visual-box">' +
        '<p class="eyebrow">' + level.emoji + ' ' + escapeHtml(level.title) + '</p>' +
        '<h2>' + escapeHtml(level.goal) + '</h2>' +
        '<div class="formula-big">' + example.a + ' × ' + example.b + ' = ' + example.answer + '</div>' +
        '<div class="visual-groups">' + example.rows.map(function (row) { return '<div class="visual-row">' + row + '</div>'; }).join('') + '</div>' +
      '</div>' +
      '<div class="tip-stack">' +
        '<div class="tip-card"><b>先看图：</b>' + example.a + ' 组，每组 ' + example.b + ' 个，一共有 ' + example.answer + ' 个。</div>' +
        '<div class="tip-card"><b>再看加法：</b>' + example.addition + ' = ' + example.answer + '。</div>' +
        '<div class="tip-card"><b>最后记口诀：</b>“' + example.chant + '”。</div>' +
        '<button class="btn btn-primary" type="button" data-action="lesson-play" data-level="' + level.id + '">我明白了，开始闯关</button>' +
      '</div>' +
    '</div>';
  }

  function renderQuestion(question, index, total, answered) {
    $('#playTitle').textContent = '第 ' + (index + 1) + ' 题 / 共 ' + total + ' 题';
    $('#progressBar').style.width = Math.round(index / total * 100) + '%';
    var visual = question.visual && question.visual.length
      ? '<div class="visual-groups compact">' + question.visual.map(function (row) { return '<div class="visual-row">' + row + '</div>'; }).join('') + '</div>'
      : '';
    var choices = question.options.map(function (option) {
      return '<button class="choice" type="button" data-answer="' + escapeHtml(option) + '">' + escapeHtml(option) + '</button>';
    }).join('');
    $('#questionCard').innerHTML = '<h3 class="question-title">' + escapeHtml(question.title) + '</h3>' +
      '<p class="question-sub">' + escapeHtml(question.subtitle) + '</p>' + visual +
      '<div class="choice-grid">' + choices + '</div>';
    $('#feedbackBox').className = 'feedback';
    $('#feedbackBox').textContent = '选择一个答案。答错也没关系，我会给你提示。';
    $('#nextQuestionBtn').style.visibility = answered ? 'visible' : 'hidden';
  }

  function showFeedback(isCorrect, question) {
    var box = $('#feedbackBox');
    box.className = 'feedback ' + (isCorrect ? 'is-ok' : 'is-bad');
    box.innerHTML = isCorrect
      ? '答对了！你点亮了一颗小星星。<br>' + escapeHtml(question.explanation)
      : '再想想，这题先放进错题救援站。<br>' + escapeHtml(question.explanation);
    $('#nextQuestionBtn').style.visibility = 'visible';
  }

  function markChoices(answer, chosen) {
    $all('.choice').forEach(function (btn) {
      btn.disabled = true;
      if (String(btn.dataset.answer) === String(answer)) btn.classList.add('is-correct');
      if (String(btn.dataset.answer) === String(chosen) && String(chosen) !== String(answer)) btn.classList.add('is-wrong');
    });
  }

  function renderRoundEnd(level, result, reward) {
    $('#questionCard').innerHTML = '<h3 class="question-title">' + level.emoji + ' 本关完成！</h3>' +
      '<p class="question-sub">你答对了 ' + result.correct + ' / ' + result.total + ' 题，获得 ' + result.stars + ' 颗星。</p>' +
      '<div class="stars">' + window.JJRewards.starText(result.stars) + '</div>';
    var unlocked = reward.unlocked.length ? '<br>新获得：' + reward.unlocked.join('、') : '';
    $('#feedbackBox').className = 'feedback is-ok';
    $('#feedbackBox').innerHTML = '闯关结束。' + (reward.improved ? '本关星级提高了。' : '继续练习可以冲击更高星级。') + unlocked;
    $('#progressBar').style.width = '100%';
    $('#nextQuestionBtn').style.visibility = 'visible';
    $('#nextQuestionBtn').textContent = '回到地图';
  }

  function renderRescue(progress, handlers) {
    var list = progress.wrongs || [];
    if (!list.length) {
      $('#rescueList').innerHTML = '<div class="empty-state">暂无迷路星星。继续闯关，答错的题会来到这里等待救援。</div>';
      return;
    }
    $('#rescueList').innerHTML = list.map(function (item, index) {
      return '<article class="rescue-card">' +
        '<h3>⭐ 迷路星星 ' + (index + 1) + '</h3>' +
        '<p><b>题目：</b>' + escapeHtml(item.title) + '</p>' +
        '<p><b>救援进度：</b>' + (item.rescued || 0) + ' / ' + window.JJ_CONFIG.rescueMasteryTarget + '</p>' +
        '<button class="btn btn-primary btn-small" type="button" data-rescue="' + index + '">开始救援</button>' +
      '</article>';
    }).join('');
    $all('[data-rescue]').forEach(function (btn) { btn.addEventListener('click', function () { handlers.onRescue(Number(btn.dataset.rescue)); }); });
  }

  function renderBadges(progress, levels) {
    var totalStars = window.JJRewards.totalStars(progress);
    var cards = [
      '<article class="badge-card"><span class="badge-icon">⭐</span><h3>星星总数</h3><p>已经收集 ' + totalStars + ' 颗星。</p></article>',
      '<article class="badge-card"><span class="badge-icon">🔥</span><h3>最佳连击</h3><p>最高连续答对 ' + (progress.stats.bestStreak || 0) + ' 题。</p></article>'
    ];
    levels.forEach(function (level) {
      var owned = progress.badges.indexOf(level.badge) !== -1;
      cards.push('<article class="badge-card">' +
        '<span class="badge-icon">' + (owned ? level.emoji : '🔒') + '</span>' +
        '<h3>' + escapeHtml(level.badge) + '</h3>' +
        '<p>' + (owned ? '已获得：' + escapeHtml(level.sticker) : '在“' + escapeHtml(level.title) + '”获得 2 星以上可解锁。') + '</p>' +
      '</article>');
    });
    $('#badgeGrid').innerHTML = cards.join('');
  }

  function setPlayLevelName(name) { $('#playLevelName').textContent = name; }
  function setRoundStars(stars) { $('#roundStars').textContent = window.JJRewards.starText(stars); }

  window.JJUI = {
    $: $,
    $all: $all,
    setView: setView,
    renderSummary: renderSummary,
    renderLevels: renderLevels,
    renderLesson: renderLesson,
    renderQuestion: renderQuestion,
    showFeedback: showFeedback,
    markChoices: markChoices,
    renderRoundEnd: renderRoundEnd,
    renderRescue: renderRescue,
    renderBadges: renderBadges,
    setPlayLevelName: setPlayLevelName,
    setRoundStars: setRoundStars
  };
}());
