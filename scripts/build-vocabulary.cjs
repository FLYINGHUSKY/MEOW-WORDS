const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const inputPath = path.join(projectRoot, 'data', 'cet6-source.jsonl');
const outputPath = path.join(projectRoot, 'data', 'cet6-vocabulary.js');

const clean = value => String(value || '')
  .replace(/<[^>]*>/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const sourceItems = fs.readFileSync(inputPath, 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .map(line => JSON.parse(line));

const groupedItems = new Map();
sourceItems.forEach(item => {
  const id = clean(item.word).toLowerCase();
  if (!id) return;
  if (!groupedItems.has(id)) groupedItems.set(id, []);
  groupedItems.get(id).push(item);
});

const entries = [...groupedItems.entries()].map(([id, items]) => {
  const word = clean(items[0].word);
  const translations = items.flatMap(item => item.translations || []).filter(item => item.translation);
  const types = [...new Set(translations.map(item => clean(item.type)).filter(Boolean))];
  const meanings = [...new Set(translations.map(item => clean(item.translation)).filter(Boolean))];
  const phrases = items.flatMap(item => item.phrases || []).filter(item => item.phrase && item.translation);
  const phoneticItem = items.find(item => item.uk || item.us);
  const sentences = items.flatMap(item => item.sentences || [])
    .map(item => ({ sentence: clean(item.sentence), translation: clean(item.translation) }))
    .filter(item => item.sentence && item.translation)
    .sort((a, b) => {
      const aScore = Math.abs(a.sentence.length - 80) + (a.sentence.toLowerCase().includes(id) ? 0 : 100);
      const bScore = Math.abs(b.sentence.length - 80) + (b.sentence.toLowerCase().includes(id) ? 0 : 100);
      return aScore - bScore;
    });
  const sample = sentences[0];
  const phrase = phrases[0];

  return {
    id,
    word,
    phonetic: phoneticItem ? `/${clean(phoneticItem.uk || phoneticItem.us)}/` : '',
    pos: types.length ? `${types.join('/')}.` : '',
    meaning: meanings.join('；') || '暂无中文释义',
    note: phrase
      ? `常用搭配：${clean(phrase.phrase)} —— ${clean(phrase.translation)}`
      : `结合例句记忆“${word}”的含义和用法。`,
    example: sample?.sentence || `This is a useful word to remember: ${word}.`,
    translation: sample?.translation || `这是一个值得记住的词：${word}。`
  };
});

const output = `/* Generated from KyleBing/english-vocabulary. Do not edit manually. */\nwindow.CET6_WORDS = ${JSON.stringify(entries)};\n`;
fs.writeFileSync(outputPath, output, 'utf8');

const report = {
  sourceLines: sourceItems.length,
  uniqueWords: entries.length,
  mergedDuplicateEntries: sourceItems.length - entries.length,
  withPhonetic: entries.filter(item => item.phonetic).length,
  withSourceSentence: entries.filter(item => !item.example.startsWith('This is a useful word')).length,
  outputBytes: Buffer.byteLength(output)
};
console.log(JSON.stringify(report, null, 2));
