(function () {
  const R = window.PokerRules;
  const $ = id => document.getElementById(id);
  const names = {UTG:'Under the Gun', HJ:'Hijack', CO:'Cutoff', BTN:'Button', SB:'Small Blind', BB:'Big Blind'};
  const signed = value => value > 0 ? `+${value}` : String(value);
  const money = value => '$' + value.toLocaleString('en-US', {maximumFractionDigits:2});
  const pick = list => list[Math.floor(Math.random() * list.length)];
  const decks = {}, stats = {};
  let mode = 'rfi', current, answered = false, transitioning = false;
  function table(headers, rows) {
    return `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  // Shuffle complete sets so each position / size / caller count gets practice.
  function draw() {
    if (!decks[mode]?.length) {
      const values = mode === 'size' ? R.sizes : mode === 'multiway' ? [0,1,2,3] : Object.keys(R[mode]);
      decks[mode] = [...values];
      for (let i = decks[mode].length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [decks[mode][i], decks[mode][j]] = [decks[mode][j], decks[mode][i]];
      }
    }
    return decks[mode].pop();
  }
  function render() {
    answered = false;
    const value = draw();
    current = {answer: 0, explanation: ''};
    $('context').innerHTML = ''; $('feedback').innerHTML = ''; $('next').hidden = true;
    $('answers').innerHTML = '';
    let options;
    if (['rfi','villain','hero'].includes(mode)) {
      $('prompt').textContent = {rfi:'Minimum score to raise?',villain:'Villain opened. Score adjustment?',hero:'Facing an open. Hero adjustment?'}[mode];
      $('question').textContent = names[value];
      current.answer = R[mode][value];
      options = mode === 'rfi' ? [0,1,2,3,4,5,6,7,8,9,10] : mode === 'villain' ? [2,1,0,-1] : [3,1,0,-1];
      if (mode === 'rfi' && value === 'SB') current.explanation = table(['Action','Min'], [['FOLD',0],['COMPLETE',1],['RAISE',3]]);
    } else if (mode === 'size') {
      const bb = pick([2,4,10]);
      $('prompt').textContent = 'Opening-size adjustment?';
      $('question').textContent = `${money(value * bb)} open`;
      $('context').innerHTML = table(['Small blind','Big blind'], [[money(bb / 2), money(bb)]]);
      current.answer = R.sizeAdjustment(value);
      current.explanation = table(['Bet ÷ big blind','Size','Adjustment'], [[`${money(value * bb)} ÷ ${money(bb)} = ${value}`,`${value} BB (${value}×)`,signed(current.answer)]]);
      options = [1,0,-1,-2];
    } else {
      const hands = [
        {label:'88',row:6,col:6}, {label:'87s',row:6,col:7},
        {label:'A5s',row:0,col:9}, {label:'KJo',row:3,col:1},
        {label:'97s',row:5,col:7}, {label:'87o',row:7,col:6}
      ];
      const hand = pick(hands);
      $('prompt').textContent = 'Net multiway adjustment?';
      $('question').textContent = hand.label;
      $('context').innerHTML = table(['Callers before you'], [[value]]);
      current.answer = R.multiway(hand.row, hand.col, value);
      current.explanation = table(['Callers','Hand recovery','Net'], [[value ? `-${value}` : '0', value && R.recovery(hand.row,hand.col) ? '+1' : '0', signed(current.answer)]]);
      options = [0,-1,-2,-3];
    }
    options.forEach(value => {
      const button = document.createElement('button'); button.type = 'button';
      button.textContent = mode === 'rfi' ? value : signed(value);
      button.onclick = () => submit(value); $('answers').appendChild(button);
    });
    const record = stats[mode] || {correct:0,total:0};
    $('stats').textContent = `${record.correct} / ${record.total} correct`;
  }
  function submit(value) {
    if (answered || transitioning) return;
    answered = true;
    const record = stats[mode] ||= {correct:0,total:0};
    const correct = value === current.answer;
    record.total++; if (correct) record.correct++;
    $('stats').textContent = `${record.correct} / ${record.total} correct`;
    $('answers').querySelectorAll('button').forEach(button => button.disabled = true);
    $('feedback').className = `feedback ${correct ? 'result-success' : 'result-error'}`;
    const format = mode === 'rfi' ? String : signed;
    $('feedback').innerHTML = table(['Your answer','Result'], [[format(value), `<span aria-label="${correct ? 'Correct' : 'Incorrect'}">${correct ? '✓' : '✗'}</span> <strong class="quick-score">${format(current.answer)}</strong>`]]) + current.explanation;
    $('feedback').animate([{opacity:0},{opacity:1}], {duration: duration()});
    $('next').hidden = false; $('next').focus({preventScroll:true});
  }
  function duration() { return matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 120; }
  async function next() {
    if (transitioning) return;
    transitioning = true; $('drill').disabled = true;
    const panel = document.querySelector('.panel');
    panel.style.minHeight = `${panel.offsetHeight}px`;
    await panel.animate([{opacity:1},{opacity:0}], {duration:duration(),fill:'forwards'}).finished;
    mode = $('drill').value; render();
    await panel.animate([{opacity:0},{opacity:1}], {duration:duration(),fill:'forwards'}).finished;
    panel.getAnimations().forEach(animation => animation.cancel());
    $('drill').disabled = false; transitioning = false;
    $('question').focus({preventScroll:true});
  }
  $('next').onclick = next;
  $('drill').onchange = next;
  render();
})();
