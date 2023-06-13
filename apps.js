
const express = require("express")
const app = express()
const port = 3030
const cors = require('cors');
const fs = require('fs');
const bodyParser = require("body-parser");
const { json } = require("stream/consumers");
app.use(cors())
app.use(bodyParser.json())



app.delete("/task", (req,res)=>{
  let id = req.query.id 
  if(!id) {
    res.send("").status(400)
  }

  console.log(id)
  fs.readFile('./tasks.json',(err, data)=> {
    if (err){
      console.log(err)
      res.send("").status(500)
    }
    let allTasks = JSON.parse(data)
    const newArr = allTasks.filter(task => {
      return task.id !== parseInt(id)
    })

    console.log(newArr)

    fs.writeFile('./tasks.json', JSON.stringify(newArr), (err,data)=>{
      if(err){
        console.log(err)
        res.send("").status(500)
      }
      
      res.send().status(200)
    })

  });

});




app.post("/new-task", (req,res) => {

  const {name, completed } = req.body

  let allTasks;

  fs.readFile('./tasks.json', (err, data) => {
    if(err) {
      console.log(err)
      res.send("").status(500)
    }  
      
      allTasks = JSON.parse(data)

    newTask = {
      id: allTasks.length + 1,
      name: name,
      completed: completed,
    }

    allTasks.push(newTask)

    fs.writeFile('./tasks.json', JSON.stringify(allTasks), (err, data) => {
      if(err) {
        console.log(err)
        res.send("").status(500)

      }

      res.send("").status(200)
    })
  })
})



app.get("/tasks", (req, res) => {
    fs.readFile('./tasks.json', (err, data) => {
      if(err) {
        console.log(err)
        res.send("").status(500)
      }
        res.json(JSON.parse(data))
    })
})


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})