const mongoose = require('mongoose');
const { create } = require('underscore');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log(err.message));

const courseSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        // match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['ai', 'cse', 'ece']
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            validator: function(v) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(v && v.length > 0);
                    }, 4000);
                });
            },
            message: 'A course should have atleast one tag.'
        }
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() {
            return this.isPublished;
        },
        min: 10,
        max: 200
    }
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
    const course = Course({
        name: 'Angular.js course',
        category: '-',
        author: 'Prat',
        tags: [],
        isPublished: true,
        price: 15
    });

    try {
        const result = await course.save();
        console.log(result);
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message)
        }
    }
}

async function getCourses() {
    // eq (equal)
    // neq (not equal)
    // gt (greater than)
    // gte (greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in 
    // nin (not in)

    const courses = await Course
        .find({ author: 'Prat', isPublished: true })
        // .find({ price: { $gte: 10, $lte: 20 } })
        // .find({ price: { $in: [10, 15, 20] } })
        .limit(10)
        .sort({ name: 1 })
        .select({ name: 1, tags: 1 });
    console.log(courses);
}

async function updateCourse(id) {
    const result = await Course.updateOne({ _id: id }, {
        $set: {
            author: 'Prat',
            isPublished: true
        }
    });
    console.log(result);
}

createCourse()