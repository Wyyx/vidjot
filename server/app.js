require('./config/config')
const express = require('express')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const passport = require('passport')
const mongoose = require('./db/mongoose')
const Idea = require('./models/idea')
const passportConfig = require('./config/passport')


// Import routes
const ideasRouter = require('./routes/ideas')
const usersRouter = require('./routes/users')



// Create server
const app = express()
const port = process.env.PORT || 3000

// Set template engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// Use middlewares
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

app.use(express.static(path.join(__dirname, 'public')))

// parse application/x-www-form-urlencoded and application/json
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

passportConfig(passport)


// Set routes
app.get('/', (req, res) => {
    let title = 'Welcome'
    res.render('index', {
        title
    })
})

app.get('/about', (req, res) => {
    res.render('about')
})


// Use external routes
app.use('/ideas', ideasRouter)
app.use('/users', usersRouter)

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})