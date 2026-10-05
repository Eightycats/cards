(function () {
  const D = window.PokerData, R = window.PokerRules;
  const $ = id => document.getElementById(id);
  const mode = document.body.dataset.mode;
  const positionNames = { UTG: 'Under the Gun', HJ: 'Hijack', CO: 'Cutoff', BTN: 'Button', SB: 'Small Blind', BB: 'Big Blind' };
  const money = amount => '$' + amount.toLocaleString('en-US', {minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2});
  const signed = n => n > 0 ? `+${n}` : String(n);
  let hand, position, steps, step, total, ledger, answered, transitioning = false, completed = 0, correct = 0;
  let showCalculation = true;
  try { showCalculation = localStorage.getItem('pokerShowCalculation') !== 'false'; } catch (_) {}
  const equationToggle = $('equation-toggle');
  if (equationToggle) {
    equationToggle.setAttribute('aria-pressed', String(showCalculation));
    equationToggle.textContent = `Running calculation: ${showCalculation ? 'shown' : 'hidden'}`;
    equationToggle.onclick = () => {
      showCalculation = !showCalculation;
      try { localStorage.setItem('pokerShowCalculation', String(showCalculation)); } catch (_) {}
      equationToggle.setAttribute('aria-pressed', String(showCalculation));
      equationToggle.textContent = `Running calculation: ${showCalculation ? 'shown' : 'hidden'}`;
      updateRunning();
    };
  }
  function sizeMath() {
    return table(['Bet ÷ big blind', 'Size', 'Adjustment'], [[
      `${money(hand.size * hand.bigBlind)} ÷ ${money(hand.bigBlind)} = ${hand.size}`,
      `${hand.size} BB (${hand.size}×)`, signed(R.sizeAdjustment(hand.size))
    ]]);
  }
  function table(headers, rows) {
    return `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  $('reference').innerHTML = mode === 'rfi'
    ? table(['Position', 'Minimum score to raise'], Object.entries(R.rfi)) + '<h3>Small blind</h3>' + table(['Action', 'Score'], [['FOLD', '0'], ['COMPLETE', '1–2'], ['RAISE', '3+']])
    : table(['Villain', 'Adjustment'], Object.entries(R.villain).map(([p,n]) => [p,signed(n)]))
      + table(['Hero', 'Adjustment'], Object.entries(R.hero).map(([p,n]) => [p,signed(n)]))
      + table(['Opening size', 'Adjustment'], [['2 BB or less','+1'],['2.25–2.5 BB','0'],['3 BB','−1'],['3.5 BB+','−2']])
      + '<p>Size adjustment is based on big blinds, not the pot ratio. Each caller before Hero subtracts 1 (maximum −3). Pocket pairs, suited connectors, and suited aces recover +1 when there are callers.</p>'
      + '<p>Final score &lt;6: FOLD · 6–8: CALL · 9+: 3-BET. Adjusted scores may be below 0 or above 10.</p>';
  function handName() {
    const high = Math.min(hand.row, hand.col), low = Math.max(hand.row, hand.col);
    return D.ranks[high] + D.ranks[low] + (high === low ? '' : hand.row < hand.col ? 's' : 'o');
  }
  function termLabel(kind) {
    return { base: handName(), villain: `Villain ${hand.villain}`, size: `${money(hand.size * hand.bigBlind)} bet`, hero: `Hero ${hand.hero}`, multiway: `${hand.callers} caller${hand.callers === 1 ? '' : 's'}` }[kind];
  }
  function showHand() {
    const {row, col} = hand;
    const r1 = D.ranks[row], r2 = D.ranks[col];
    const suited = row < col;
    $('hand').innerHTML = `<img src="img/cards/S${r1}.png" alt="${r1} of spades"><img src="img/cards/${suited ? 'S' : 'H'}${r2}.png" alt="${r2} of ${suited ? 'spades' : 'hearts'}">`;
    $('hand-label').textContent = handName();
  }
  function start() {
    answered = false;
    hand = R.scenario();
    document.querySelector('.subtitle').textContent = `6-max · Blinds ${money(hand.bigBlind / 2)} / ${money(hand.bigBlind)} · Stack ${money(hand.bigBlind * 100)}`;
    position = R.positions[Math.floor(Math.random() * 5)];
    total = null; ledger = []; step = 0;
    steps = ['base', 'villain', 'size', 'hero'];
    if (hand.callers) steps.push('multiway');
    steps.push('decision');
    showHand(); render();
  }
  function button(label, fn) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.onclick = fn;
    return b;
  }
  function choices(values) {
    const group = document.createElement('div'); group.className = 'actions';
    values.forEach(v => group.appendChild(button(typeof v === 'number' ? signed(v) : v, () => submit(v))));
    $('answers').appendChild(group);
  }
  function numeric() {
    const form = document.createElement('form');
    form.innerHTML = '<label for="guess">Base hand score</label><input id="guess" type="range" min="0" max="10" step="1" value="5"><output for="guess" id="value">5</output>';
    const actions = document.createElement('div'); actions.className = 'actions';
    actions.appendChild(button('FOLD', () => submit('FOLD')));
    const b = button('Check answer', () => {}); b.type = 'submit'; actions.appendChild(b); form.appendChild(actions);
    form.onsubmit = e => { e.preventDefault(); submit(Number($('guess').value)); };
    $('answers').appendChild(form);
    $('guess').oninput = () => { $('value').textContent = $('guess').value; };
  }
  function updateRunning() {
    const finalResult = answered && steps[step] === 'decision';
    $('running').hidden = mode === 'rfi' || total === null || (!showCalculation && !finalResult);
    if (equationToggle) equationToggle.hidden = finalResult;
    $('running').innerHTML = ledger.map(({kind, value}, index) =>
      `<span class="equation-part">${index ? `<span class="operator">${value < 0 ? '−' : '+'}</span>` : ''}<span class="term"><span class="term-label">${termLabel(kind)}</span><strong>${index ? Math.abs(value) : value}</strong></span></span>`
    ).join('') + (total === null ? '' : `<span class="equation-part"><span class="operator">=</span><span class="term"><span class="term-label">Score</span><strong>${total}</strong></span></span>`);
    $('running').setAttribute('aria-label', ledger.map(({kind,value}) => `${termLabel(kind)} ${signed(value)}`).join(' plus ') + ` equals ${total}`);
  }
  function render() {
    answered = false; $('answers').hidden = false; $('answers').innerHTML = ''; $('feedback').textContent = ''; $('next').hidden = true;
    updateRunning();
    if (mode === 'rfi') {
      $('progress').hidden = true; $('question').textContent = positionNames[position];
      $('context').innerHTML = '';
      choices(position === 'SB' ? ['FOLD','COMPLETE','RAISE'] : ['FOLD','RAISE']); return;
    }
    $('progress').textContent = `Step ${step + 1}: ${steps[step] === 'decision' ? 'Final decision' : 'Score the hand'}`;
    const kind = steps[step];
    const content = {
      base: ['Base score', []],
      villain: ['Position adjustment', [['Villain', hand.villain]]],
      size: ['Raise adjustment', [['Blinds', `${money(hand.bigBlind / 2)} / ${money(hand.bigBlind)}`], ['Open', money(hand.size * hand.bigBlind)], ['Pot', money(hand.pot * hand.bigBlind)]]],
      hero: ['Position adjustment', [['Hero', hand.hero]]],
      multiway: ['Multiway adjustment', [['Callers', hand.callers], ['Hand', handName()]]],
      decision: ['Your action?', [['Villain', hand.villain], ['Hero', hand.hero], ['Open', money(hand.size * hand.bigBlind)], ['Callers', hand.callers]]]
    };
    $('question').textContent = content[kind][0];
    $('context').innerHTML = content[kind][1].length ? table(['', ''], content[kind][1]).replace(/<thead>.*?<\/thead>/, '') : '';
    if (kind === 'base') numeric();
    else if (kind === 'villain') choices([2,1,0,-1]);
    else if (kind === 'multiway') choices([0,-1,-2,-3]);
    else if (kind === 'decision') choices(['FOLD','CALL','3-BET']);
    else if (kind === 'size') choices([1,0,-1,-2]);
    else choices([3,1,0,-1,-2]);
  }
  function decisionResult(guess, actual, score) {
    const rows = mode === 'rfi'
      ? position === 'SB' ? [['FOLD','0'], ['COMPLETE','1'], ['RAISE','3']]
        : [['FOLD','0'], ['RAISE',R.rfi[position]]]
      : [['FOLD','0'], ['CALL','6'], ['3-BET','9']];
    return `<table class="result-table"><caption>${guess === actual ? '<span aria-label="Correct">✓</span>' : '✗ Not quite'}</caption><thead><tr><th>Action</th><th class="minimum-heading">Min</th><th>Result</th></tr></thead><tbody>${rows.map(([action,minimum]) => {
      const isAnswer = action === actual, isChoice = action === guess;
      const status = isAnswer ? `<span class="${guess === actual ? 'score-right' : 'score-wrong'}"><span aria-label="${guess === actual ? 'Correct' : 'Incorrect'}">${guess === actual ? '✓' : '✗'}</span> <strong class="result-score">${score}</strong></span>` : isChoice ? '<span aria-label="Incorrect choice">✗</span>' : '';
      return `<tr class="${isChoice && !isAnswer ? 'result-wrong' : isAnswer ? 'result-right' : ''}"><th scope="row">${action}</th><td class="minimum-score">${minimum}</td><td>${status}</td></tr>`;
    }).join('')}</tbody></table>`;
  }
  function submit(guess) {
    if (answered) return;
    answered = true;
    let actual, kind = mode === 'rfi' ? 'rfi' : steps[step];
    const base = D.scores[hand.row][hand.col];
    if (kind === 'base' && guess === 'FOLD') {
      const result = R.evaluate(hand, base);
      total = result.total; ledger = result.ledger;
      actual = result.action;
      step = steps.length - 1;
      kind = 'decision';
      $('answers').hidden = true;
      $('progress').textContent = 'Early fold';
      $('question').textContent = 'Fold result';
      $('context').innerHTML = table(['Detail', 'Value'], [
        ['Villain', hand.villain], ['Hero', hand.hero],
        ['Open', money(hand.size * hand.bigBlind)], ['Pot', money(hand.pot * hand.bigBlind)], ['Callers', hand.callers]
      ]);
      updateRunning();
    } else if (kind === 'rfi') {
      actual = R.rfiAction(base, position);
    } else if (kind === 'decision') {
      actual = R.action(total);
    } else {
      const adjustments = { base, villain: R.villain[hand.villain], size: R.sizeAdjustment(hand.size), hero: R.hero[hand.hero], multiway: R.multiway(hand.row, hand.col, hand.callers) };
      actual = adjustments[kind];
      total = kind === 'base' ? actual : total + actual;
      ledger.push({kind, value: actual});
      updateRunning();
    }
    const exact = guess === actual;
    const final = kind === 'decision' || kind === 'rfi';
    if (final) updateRunning();
    $('feedback').className = 'feedback ' + (exact ? 'result-success' : 'result-error');
    $('feedback').innerHTML = final ? decisionResult(guess, actual, kind === 'rfi' ? base : total)
      : table(['Your choice', 'Correct', 'Result'], [[signed(guess), signed(actual), exact ? '<span aria-label="Correct">✓</span>' : `✗ Off by ${Math.abs(guess - actual)} ${guess > actual ? '(high)' : '(low)'}`]])
        + (kind === 'multiway' ? table(['Callers', 'Recovery', 'Net'], [[`-${hand.callers}`, R.recovery(hand.row, hand.col) ? '+1' : '0', signed(actual)]]) : '');
    if (kind === 'size' || (final && mode !== 'rfi')) $('feedback').innerHTML += sizeMath();
    $('feedback').animate([{opacity:0}, {opacity:1}], {duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 160});
    $('answers').querySelectorAll('button,input').forEach(el => el.disabled = true);
    if (final) { completed++; if (exact) correct++; $('stats').textContent = `${correct} / ${completed} final decisions correct`; }
    $('next').textContent = final ? 'Next hand' : 'Continue'; $('next').hidden = false; $('next').focus({preventScroll:true});
  }
  $('next').onclick = async () => {
    if (transitioning) return;
    transitioning = true;
    const panel = document.querySelector('.panel');
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 120;
    panel.style.minHeight = `${panel.offsetHeight}px`;
    await panel.animate([{opacity:1}, {opacity:0}], {duration, fill:'forwards'}).finished;
    if (mode === 'rfi' || steps[step] === 'decision') start();
    else { step++; render(); }
    await panel.animate([{opacity:0}, {opacity:1}], {duration, fill:'forwards'}).finished;
    panel.getAnimations().forEach(animation => animation.cancel());
    $('question').focus({preventScroll:true});
    transitioning = false;
  };
  start();
})();
