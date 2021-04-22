
const Joi = require('joi')
const express = require('express')
const app = express()
app.use(express.json())

const students = [
  { 
    name: 'Joe0',
    code: '123456',
    id: 0,
  },
  { 
    name: 'Joe1',
    code: '123789',
    id: 1,
  },
  { 
    name: 'Joe2',
    code: '456789',
    id: 2,
  },
]
const courses = [
  {
    name: 'Course0',
    code: '123456',
    id: 0,
    description: 'This is Course 0'
  },
  {
    name: 'Course1',
    code: '456789',
    id: 1,
    description: 'This is Course 1'
  },
]

function validateStudent(student){
  const schema = {
    name: Joi.string().regex(/^([a-z]|[A-Z]|'|-)+$/).required(),
    code: Joi.string().min(7).required(),
    id: Joi.number()
  }

  return Joi.validate(student, schema)
}

function validateCourse(course){
  const schema = {
    name: Joi.string().min(5).required(),
    code: Joi.string().min(6).regex(/^([a-z]|[A-Z]){3}\d{3}$/).required(),
    id: Joi.number(),
    description: Joi.string().max(200)
  }

  return Joi.validate(course, schema)
}

//Get All Students
app.get('/api/students', (req, res) => {
  res.send(students)
})

//Get Single Student
app.get('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id))
  if(!student) res.status(404).send('Student Not Found')
  res.send(student)
})

//Update Student
app.put('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id))
  if(!student) return res.status(404).send('Student Not Found')

  result = validateStudent(req.body)
  if(result.error) {
    res.status(400).send(result.error.details[0].message)
    return
  }
  
  student.name = req.body.name
  student.code = req.body.code 
  res.send(student)
})

//Delete Student
app.delete('/api/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id))
  if(!student) return res.status(404).send('Student Not Found')

  const index = students.indexOf(student)
  students.splice(index, 1)
  res.send(student)
})

//Create Student
app.post('/web/students/create', (req, res) => {
  result = validateStudent(req.body)
  if(result.error) {
    res.status(400).send(result.error.details[0].message)
    return
  }
  const student = {
    id: students.length,
    name: req.body.name,
    code: req.body.code
  }
  students.push(student)
  res.send(student)
})


//Get All Courses
app.get('/api/courses', (req, res) => {
  res.send(courses)
})

//Get Single Course
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if(!course) res.status(404).send('Course Not Found')
  res.send(course)
})

//Update Course
app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id))
  if(!course) return res.status(404).send('Course Not Found')
  result = validateCourse(req.body)
  if(result.error) {
    res.status(400).send(result.error.details[0].message)
    return
  }
  
  course.name = req.body.name
  course.code = req.body.code 
  if(req.body.description) course.description = req.body.description
  res.send(course)
})

//Delete Course
app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(s => s.id === parseInt(req.params.id))
  if(!course) return res.status(404).send('Course Not Found')

  const index = courses.indexOf(course)
  courses.splice(index, 1)
  res.send(course)
})

//Create Course
app.post('/web/courses/create', (req, res) => {
  result = validateCourse(req.body)
  if(result.error) {
    res.status(400).send(result.error.details[0].message)
    return
  }
  const course = {
    id: courses.length,
    name: req.body.name,
    code: req.body.code,
    description: req.body.description
  }
  courses.push(course)
  res.send(course)
})



const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on Port ${port}`))