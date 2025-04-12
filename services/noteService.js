const fs = require('fs');
const path = require('path');

const notesPath = path.join(__dirname, '../database/users.json');

// Read all notes from database
function readDatabase() {
  try {
    const data = fs.readFileSync(notesPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Save all notes to database
function writeDatabase(data) {
  fs.writeFileSync(notesPath, JSON.stringify(data, null, 2));
}

// Add a note for a user
function addNote(phone, content) {
  const db = readDatabase();
  let user = db.find(u => u.phone === phone);

  if (!user) {
    user = { phone, notes: [] };
    db.push(user);
  }

  const note = {
    id: Date.now(),
    content,
    createdAt: new Date().toISOString()
  };

  user.notes.push(note);
  writeDatabase(db);

  return note;
}

// Get notes for a user
function getNotes(phone) {
  const db = readDatabase();
  const user = db.find(u => u.phone === phone);
  return user ? user.notes : [];
}

// Delete note by ID
function deleteNote(phone, noteId) {
  const db = readDatabase();
  const user = db.find(u => u.phone === phone);

  if (!user) return false;

  const index = user.notes.findIndex(n => n.id == noteId);
  if (index === -1) return false;

  user.notes.splice(index, 1);
  writeDatabase(db);
  return true;
}

module.exports = {
  addNote,
  getNotes,
  deleteNote
};
