import https from 'https';
import fs from 'fs';

const url = 'https://cdn-icons-png.flaticon.com/512/3659/3659898.png';
const file = fs.createWriteStream('public/icon-512.png');

https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download Completed');
  });
}).on('error', (err) => {
  fs.unlink('public/icon-512.png', () => {});
  console.error('Error downloading:', err.message);
});
