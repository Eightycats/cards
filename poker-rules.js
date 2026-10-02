// Rules transcribed from holdem_preflop_cheat_sheet_updated.pdf.
// 6-max, approximately 100bb. These drills teach the sheet's default actions.
(function () {
  const positions = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
  const rfi = { UTG: 7, HJ: 6, CO: 5, BTN: 2, SB: 3 };
  const villain = { UTG: -1, HJ: 0, CO: 1, BTN: 2, SB: 2 };
  const hero = { HJ: 0, CO: 0, BTN: 1, SB: -1, BB: 3 };
  const sizes = [2, 2.25, 2.5, 3, 3.5, 4];
  function sizeAdjustment(size) {
    if (size <= 2) return 1;
    if (size <= 2.5) return 0;
    if (size < 3.5) return -1;
    return -2;
  }
  function recovery(row, col) {
    return row === col || (row < col && (row === 0 || col - row === 1));
  }
  function multiway(row, col, callers) {
    return callers === 0 ? 0 : -Math.min(callers, 3) + (recovery(row, col) ? 1 : 0);
  }
  function rfiAction(score, position) {
    if (score >= rfi[position]) return 'RAISE';
    if (position === 'SB' && score >= 1) return 'COMPLETE';
    return 'FOLD';
  }
  function action(score) { return score >= 9 ? '3-BET' : score >= 6 ? 'CALL' : 'FOLD'; }
  function evaluate(hand, base) {
    const ledger = [
      { kind: 'base', value: base },
      { kind: 'villain', value: villain[hand.villain] },
      { kind: 'size', value: sizeAdjustment(hand.size) },
      { kind: 'hero', value: hero[hand.hero] },
      { kind: 'multiway', value: multiway(hand.row, hand.col, hand.callers) }
    ];
    const total = ledger.reduce((sum, term) => sum + term.value, 0);
    return { ledger, total, action: action(total) };
  }
  function scenario(random = Math.random) {
    const pick = n => Math.floor(random() * n);
    const row = pick(13), col = pick(13);
    // Choose only seats that have yet to act after the opener.
    const isMultiway = random() < 0.15;
    const villainIndex = pick(isMultiway ? 4 : 5);
    const gap = isMultiway ? 2 : 1;
    const heroIndex = villainIndex + gap + pick(6 - villainIndex - gap);
    // Other callers can only occupy seats between the opener and Hero.
    const available = heroIndex - villainIndex - 1;
    const callers = isMultiway ? 1 + pick(Math.min(3, available)) : 0;
    const size = sizes[pick(sizes.length)];
    // Callers are selected from earliest available seats. Account for a calling SB.
    const callerSeats = positions.slice(villainIndex + 1, villainIndex + 1 + callers);
    const blindContributions = 1.5 - (villainIndex === 4 ? 0.5 : 0) - (callerSeats.includes('SB') ? 0.5 : 0);
    return { row, col, villain: positions[villainIndex], hero: positions[heroIndex], callers, size,
      bigBlind: [2, 4, 10][pick(3)], pot: size * (1 + callers) + blindContributions };
  }
  const rules = { positions, rfi, villain, hero, sizes, sizeAdjustment, recovery, multiway, rfiAction, action, evaluate, scenario };
  if (typeof module !== 'undefined') module.exports = rules;
  else window.PokerRules = rules;
})();
