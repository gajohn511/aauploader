// utilities

const cleanup = function(word) {
  return String(word).replace(/["]+/g, "");
};

const parsenum = function(word) {
  let retVal = 0;
  try {
    retVal = parseInt(
      cleanup(word)
        .match(/\d/g)
        .join(""),
      10
    );
  } catch (e) {
    // oooops
  }
  return retVal;
};

const parseflo = function(word) {
  return parseFloat(word.replace(/[^0-9\.-]/g, ""));
};

const parseme = function(line) {
  const hsh = [];
  let start = false;
  let word = "";

  for (let i = 0; i < line.length; i++) {
    // debugger;
    const c = line.charAt(i);

    if (!start && c === ",") continue;

    if (start) {
      if (c === '"') {
        start = false;
        hsh.push(word);
        word = "";
      } else word += c;
    } else if (c === '"') {
      start = true;
    }
  }

  return hsh;
};

const isEmpty = function(str) {
  return !str || /^\s*$/.test(str);
};

module.exports.util = {
  cleanup,
  parsenum,
  parseflo,
  parseme,
  isEmpty
};
