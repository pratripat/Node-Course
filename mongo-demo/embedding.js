const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
})

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course
    .find()
  console.log(courses);
}

async function addAuthor(courseID, author) {
    const course = await Course.findById(courseID);
    course.authors.push(author);
    course.save();
}

async function removeAuthor(courseID, authorID) {
    const course = await Course.findById(courseID);
    if (!course) return console.log('Course not found.');

    // Remove the author by _id using pull
    course.authors.pull({ _id: authorID });
    course.save();
}

removeAuthor('6867e3ac5df91e3fb69e7ffd', '6867e3ac5df91e3fb69e7ffc')
