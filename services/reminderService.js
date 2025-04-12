const schedule = require('node-schedule');

// In-memory reminders (will reset if server restarts)
let reminders = [];

// Schedule reminder using node-schedule
function setReminder(time, phone, message, callback) {
  const date = new Date(time);

  if (isNaN(date.getTime()) || date < new Date()) {
    return false;
  }

  const job = schedule.scheduleJob(date, () => {
    callback(phone, message);
  });

  reminders.push({
    phone,
    message,
    time: date,
    job
  });

  return true;
}

// List active reminders
function getReminders(phone) {
  return reminders.filter(r => r.phone === phone);
}

module.exports = {
  setReminder,
  getReminders
};
