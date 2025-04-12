const fs = require('fs');
const path = require('path');
const { setReminder } = require('../services/reminderService');

// Path to the database file that stores user notes
const notesFilePath = path.join(__dirname, '../database/users.json');

// Function to get all notes
const getNotes = () => {
  try {
    const data = fs.readFileSync(notesFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading notes file:', error);
    return [];
  }
};

// Function to save notes to the file
const saveNotes = (notes) => {
  try {
    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

// Command: .note [note_content]
const addNote = (phone, noteContent) => {
  const notes = getNotes();
  
  // Check if the user already has a record
  let userNotes = notes.find(note => note.phone === phone);
  
  if (!userNotes) {
    userNotes = { phone, notes: [] };
    notes.push(userNotes);
  }

  // Add new note
  userNotes.notes.push({
    id: Date.now(), // Unique ID based on timestamp
    content: noteContent,
    createdAt: new Date().toISOString(),
  });

  saveNotes(notes);
  return 'Note saved successfully!';
};

// Command: .mynotes
const viewNotes = (phone) => {
  const notes = getNotes();
  const userNotes = notes.find(note => note.phone === phone);
  
  if (!userNotes || userNotes.notes.length === 0) {
    return 'You have no notes saved.';
  }

  return userNotes.notes.map(note => `ID: ${note.id} - ${note.content}`).join('\n');
};

// Command: .deletenote [note_id]
const deleteNote = (phone, noteId) => {
  const notes = getNotes();
  const userNotes = notes.find(note => note.phone === phone);
  
  if (!userNotes || userNotes.notes.length === 0) {
    return 'You have no notes to delete.';
  }

  const noteIndex = userNotes.notes.findIndex(note => note.id == noteId);
  if (noteIndex === -1) {
    return 'Note not found!';
  }

  // Remove note from the list
  userNotes.notes.splice(noteIndex, 1);
  saveNotes(notes);

  return 'Note deleted successfully!';
};

// Command: .remind [time] [note_content]
const setNoteReminder = (phone, time, noteContent) => {
  const reminderTime = new Date(time).getTime();
  const currentTime = new Date().getTime();
  
  if (reminderTime <= currentTime) {
    return 'Reminder time must be in the future.';
  }

  // Add the reminder using the reminderService
  const reminderMessage = `Reminder: ${noteContent}`;

  // Schedule reminder
  setReminder(reminderTime, phone, reminderMessage);
  return `Reminder set for ${new Date(reminderTime).toLocaleString()}.`;
};

module.exports = {
  addNote,
  viewNotes,
  deleteNote,
  setNoteReminder,
};
                         
