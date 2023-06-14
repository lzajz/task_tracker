// app.js

const express = require('express');
const app = express();
const port = 3030;
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// GET /tasks
app.get('/tasks', (req, res) => {
  fs.readFile('./tasks.json', (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.json(JSON.parse(data));
    }
  });
});


// POST /new-task
app.post('/new-task', (req, res) => {
  const { name, completed } = req.body;

  fs.readFile('./tasks.json', (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      const allTasks = JSON.parse(data);
      const newTask = {
        id: allTasks.length + 1,
        name: name,
        completed: completed,
      };

      allTasks.push(newTask);

      fs.writeFile('./tasks.json', JSON.stringify(allTasks), (err) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});


// DELETE /task/:id
app.delete('/task/:id', (req, res) => {
  const id = req.params.id;

  if (!id) {
    res.sendStatus(400);
    return;
  }

  fs.readFile('./tasks.json', (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    const allTasks = JSON.parse(data);
    const updatedTasks = allTasks.filter(task => task.id !== parseInt(id));

    fs.writeFile('./tasks.json', JSON.stringify(updatedTasks), (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  });
});



// Serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
