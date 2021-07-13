const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });


//create a route for creating a workout
app.post("/api/workouts", ({ body }, res) => {
    db.Workout.create(body)
    .then(dbWorkout => {
        res.json(dbWorkout);
    })
    .catch(err => {
        res.json(err); 
    })
}); 

app.put("/api/workouts/:id", (req, res)=>{
    db.Workout.findOneAndUpdate(req.params.id, {$push: { exercises: req.body}}, {new: true})
    .then(dbWorkout => {
        res.json(dbWorkout); 
    })
    .catch(err => {
        res.json(err); 
    })
}); 









app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });
  