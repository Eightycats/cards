const numberPegs = {
  0: "Zoo",
  1: "aLe", 2: "heN", 3: "haM", 4: "oaR", 5: "hiVe",
  6: "Bee", 7: "Tea", 8: "SHoe", 9: "Goo", 10: "LaCe",
  11: "LiLy", 12: "LiNe", 13: "LaMb", 14: "LaiR", 15: "LoaF",
  16: "LiP", 17: "LighT", 18: "LeDGe", 19: "LeG", 20: "NoSe",
  21: "NaiL", 22: "NaNNy", 23: "gNoMe", 24: "NutcrackeR", 25: "kNiFe",
  26: "NoB", 27: "NeT", 28: "NoTCH", 29: "NoG", 30: "MaZe",
  31: "MaiL", 32: "MaN", 33: "MuMMy", 34: "MiRRoR", 35: "MuFF",
  36: "MaP", 37: "MaT", 38: "MaTCH", 39: "MuG", 40: "RoSe",
  41: "RaiL", 42: "RaiN", 43: "RaM", 44: "RoaR", 45: "RaVe",
  46: "RoB", 47: "RaT", 48: "RoaCH", 49: "RaG", 50: "FuSe",
  51: "FaLL", 52: "FaN", 53: "FoaM", 54: "FiRe", 55: "FiFe",
  56: "FiB", 57: "FooT", 58: "FiSH", 59: "FroG", 60: "BuS",
  61: "BaLL", 62: "BoNe", 63: "BoMB", 64: "BeaR", 65: "BeeF",
  66: "BaBy", 67: "BoaT", 68: "BeaCH", 69: "BaG", 70: "ToeS",
  71: "TiLe", 72: "TiN", 73: "ToMB", 74: "TiRe", 75: "TrouGH",
  76: "TuB", 77: "ToasT", 78: "DitCH", 79: "ToGa", 80: "CHeeSe",
  81: "SHeLL", 82: "CHaiN", 83: "JaM", 84: "JaR", 85: "CHeF",
  86: "SHiP", 87: "SHeeT", 88: "JuDGe", 89: "JuG", 90: "GooSe",
  91: "GoaL", 92: "GuN", 93: "GuM", 94: "GuaRd", 95: "GiFr",
  96: "GaP", 97: "GaTe", 98: "GuSH", 99: "GaG", 100: "LaCeS"
};

// All numbers that have images (exclude 51)
const numberList = [0];
for (let i = 1; i <= 100; i++) {
  if (i !== 51) numberList.push(i);
}

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getNumberImageSrc(n) {
  return `img/numbers/${n}.png`;
}

function highlightConsonants(word) {
  let html = '';
  for (const ch of word) {
    if (ch >= 'A' && ch <= 'Z') {
      html += `<span class="highlight-letter">${ch}</span>`;
    } else {
      html += ch;
    }
  }
  return html;
}
