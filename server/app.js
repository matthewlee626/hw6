const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const thumbsupply = require('thumbsupply');

const videos = [
  {
      id: 'fire',
      poster: '/video/fire/poster',
      duration: '3 mins',
      name: 'Fire'
  },
  {
      id: 'ocean',
      poster: '/video/ocean/poster',
      duration: '4 mins',
      name: 'Ocean'
  },
  {
      id: 'sky',
      poster: '/video/sky/poster',
      duration: '2 mins',
      name: 'Sky'
  },
];

const app = express();

app.use(cors());

app.get('/videos', (req, res) => res.json(videos));

app.get('/video/:id', (req, res) => {
  const path = `assets/${req.params.id}.mp4`;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1]
          ? parseInt(parts[1], 10)
          : fileSize-1;
      const chunksize = (end-start) + 1;
      const file = fs.createReadStream(path, {start, end});
      const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
  } else {
      const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(path).pipe(res);
  }
});

app.get('/video/:id/data', (req, res) => {
  const matches = videos.filter(obj => obj.id === req.params.id)
  res.json(matches[0]);
});

app.get('/video/:id/poster', (req, res) => {
  thumbsupply.generateThumbnail(`assets/${req.params.id}.mp4`)
  .then(thumb => res.sendFile(thumb));
});

app.listen(4000, () => {
  console.log('Listening on port 4000!')
});
