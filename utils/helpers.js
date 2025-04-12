function formatNote(note, index) {
  return `(${index + 1}) ${note.content} - [${new Date(note.createdAt).toLocaleString()}]`;
}

function isCommand(text, command) {
  return text.toLowerCase().startsWith(command.toLowerCase());
}

function extractArguments(text, command) {
  return text.slice(command.length).trim();
}

module.exports = {
  formatNote,
  isCommand,
  extractArguments
};
