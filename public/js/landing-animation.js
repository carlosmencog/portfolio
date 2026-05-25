(function () {
  'use strict';

  // Respect reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var avatar   = document.getElementById('anim-avatar');
  var titleEl  = document.getElementById('anim-title');
  var sentences = Array.from(document.querySelectorAll('.anim-sentence'));
  var button   = document.getElementById('expand-sidebar-btn');
  var social   = document.getElementById('anim-social');

  if (!avatar || !titleEl || !sentences.length) return;

  // ── Timing ───────────────────────────────────────────────
  var WORD_DELAY     = 32;   // ms between each word
  var CHAR_DELAY     = 40;   // ms between each character (title)
  var SENTENCE_PAUSE = 180;  // ms pause between paragraphs

  // ── Initial hidden state ─────────────────────────────────
  avatar.style.opacity = '0';

  titleEl.style.opacity   = '0';
  titleEl.style.transform = 'translateY(6px)';

  sentences.forEach(function (s) {
    s.style.opacity   = '0';
    s.style.transform = 'translateY(8px)';
  });

  if (button) button.style.opacity = '0';
  if (social) social.style.opacity = '0';

  // ── Skip logic ───────────────────────────────────────────
  var done = false;
  var skipCallbacks = [];
  var titleTextFull = ''; // holds full title text while animateTitle is running

  function skipAll() {
    if (done) return;
    done = true;

    skipCallbacks.splice(0).forEach(function (cb) { cb(); });

    // Restore full title text if skip fires while it's being typed
    if (titleTextFull) {
      titleEl.textContent = titleTextFull;
      titleTextFull = '';
    }

    [avatar, titleEl, button, social].forEach(function (el) {
      if (!el) return;
      el.style.transition = el.id === 'expand-sidebar-btn' ? 'opacity 350ms ease, background-color .5s ease-in-out' : 'none';
      el.style.opacity    = '1';
      el.style.transform  = '';
      el.style.minHeight  = '';
    });
    sentences.forEach(function (el) {
      el.style.transition = 'none';
      el.style.opacity    = '1';
      el.style.transform  = '';
    });
    document.querySelectorAll('.anim-word').forEach(function (w) {
      w.style.transition = 'none';
      w.style.opacity    = '1';
    });

    document.removeEventListener('click', skipAll);
  }

  document.addEventListener('click', skipAll);

  // ── Promise helpers ──────────────────────────────────────
  function wait(ms) {
    if (done) return Promise.resolve();
    return new Promise(function (resolve) {
      var id = setTimeout(resolve, ms);
      skipCallbacks.push(function () { clearTimeout(id); resolve(); });
    });
  }

  function fadeInEl(el, ms) {
    if (!el) return Promise.resolve();
    if (done) { el.style.opacity = '1'; return Promise.resolve(); }
    return new Promise(function (resolve) {
      el.style.transition = 'opacity ' + ms + 'ms ease, background-color .5s ease-in-out';
      void el.getBoundingClientRect();
      el.style.opacity = '1';
      var id = setTimeout(resolve, ms);
      skipCallbacks.push(function () { clearTimeout(id); resolve(); });
    });
  }

  // ── Split element into word-level spans ──────────────────
  function splitToWords(el) {
    var childNodes = Array.from(el.childNodes);
    el.innerHTML = '';
    var words = [];

    childNodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            el.appendChild(document.createTextNode(part));
          } else {
            var span = document.createElement('span');
            span.className = 'anim-word';
            span.textContent = part;
            el.appendChild(span);
            words.push(span);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.classList.add('anim-word');
        el.appendChild(node);
        words.push(node);
      }
    });

    return words;
  }

  // ── Animate title: character by character ────────────────
  function animateTitle() {
    if (done) return Promise.resolve();
    titleTextFull = titleEl.textContent;
    var text = titleTextFull;
    // Lock height before clearing so the empty <h5> doesn't collapse and
    // trigger a flex re-center that shifts the avatar position
    titleEl.style.minHeight = titleEl.offsetHeight + 'px';
    titleEl.textContent = '';

    // Slide and fade the title container in
    titleEl.style.transition = 'opacity 280ms ease, transform 380ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    void titleEl.getBoundingClientRect();
    titleEl.style.opacity   = '1';
    titleEl.style.transform = 'translateY(0)';

    var i = 0;
    function nextChar() {
      if (done || i >= text.length) {
        titleEl.style.minHeight = '';
        titleTextFull = '';
        return Promise.resolve();
      }
      return wait(CHAR_DELAY).then(function () {
        if (done) return;
        titleEl.appendChild(document.createTextNode(text[i]));
        i++;
        return nextChar();
      });
    }
    return nextChar();
  }

  // ── Animate a paragraph: word by word ────────────────────
  function animateSentence(el) {
    if (done) return Promise.resolve();

    // Slide and fade the paragraph container in, then stream words
    el.style.opacity    = '1';
    el.style.transition = 'transform 450ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    void el.getBoundingClientRect();
    el.style.transform = 'translateY(0)';

    var words = splitToWords(el);

    var i = 0;
    function nextWord() {
      if (done || i >= words.length) return Promise.resolve();
      return wait(WORD_DELAY).then(function () {
        if (done) return;
        words[i].style.opacity = '1';
        i++;
        return nextWord();
      });
    }
    return nextWord();
  }

  // ── Main sequence ────────────────────────────────────────
  function run() {
    // 1. Avatar
    return fadeInEl(avatar, 500)
      .then(function () { return wait(120); })

      // 2. Title
      .then(function () { return animateTitle(); })
      .then(function () { return wait(SENTENCE_PAUSE); })

      // 3. Paragraphs
      .then(function () {
        return sentences.reduce(function (chain, sentence) {
          return chain
            .then(function () { return animateSentence(sentence); })
            .then(function () { return wait(SENTENCE_PAUSE); });
        }, Promise.resolve());
      })

      // 4. Projects button
      .then(function () { return wait(80); })
      .then(function () { return fadeInEl(button, 350); })

      // 5. Social links
      .then(function () { return wait(80); })
      .then(function () { return fadeInEl(social, 350); })

      .then(function () {
        done = true;
        document.removeEventListener('click', skipAll);
      });
  }

  setTimeout(run, 80);
}());
