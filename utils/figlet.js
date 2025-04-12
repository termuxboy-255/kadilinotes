const figlet = require('figlet');

function showBanner() {
  figlet('Kadili Notes Bot', (err, data) => {
    if (err) {
      console.log('Error generating banner:', err);
      return;
    }
    console.log(data);
  });
}

module.exports = showBanner;
