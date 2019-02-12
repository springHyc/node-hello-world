var fortunes = [
  "携带一名家属游玩",
  "go to bali",
  "do you love me ?",
  "i love you !"
];

exports.getFortune = function() {
  return fortunes[Math.floor(Math.random() * fortunes.length)];
};
