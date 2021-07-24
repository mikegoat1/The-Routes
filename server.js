const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

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
    db.Workout.create({})
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        })
});


//Working on updating 
app.put("/api/workouts/:id", (req, res) => {
    //Grabing the parameter from the URL and adding it to the exercise object property 
    db.Workout.findOneAndUpdate(req.params.id, { $push: { exercises: req.body } }, { new: true })
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        })
});

// Get route
app.get("/api/workouts", (req, res) => {
    db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: { $sum: "$exercises.duration" },
            }
        }
    ])
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        })
});


//Get route limit 

app.get("/api/workouts/range", (req, res) => {
    db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: { $sum: "$exercises.duration" },
            }
        }
    ])
        .limit(7)
        .then(dbWorkout => {

            res.json(dbWorkout);
        })

        .catch(err => {
            res.json(err);
        })
});


//Delete Route 

app.delete('/api/workouts', ({ body }, res) => {
    db.Workout.findByIdAndDelete(body.id)
    .then(() => {
        res.json(true); 
    })
    .catch(err => {
        res.json(err); 
    });
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/exercise.html"))
})

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/stats.html"))
})







app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});
