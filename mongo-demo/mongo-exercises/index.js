const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log(err.message));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [ String ],
    date: { type: Date, default: Date.now },    
    price: Number,
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema)

async function getCourses() {
    const courses = await Course
        .find({ isPublished: true })
        .or([
            { price: { $gte: 15 } },
            { name: /.*by.*/i }
        ])
    console.log(courses);
}

getCourses();