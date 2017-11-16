const express = require('express')
const router = express.Router()
const Idea = require('./../models/idea')
const ensureAuthenticated = require('../middlewares/auth')



router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add')
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then((idea) => {

            if (idea.user != req.user._id) {
                req.flash('error_msg', 'Not Authorized')
                res.redirect('/ideas')
            } else {
                res.render('ideas/edit', {
                    idea
                })
            }

        })
})

router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({
            user: req.user._id
        })
        .sort({
            date: 'desc'
        })
        .then((ideas) => {
            res.render('ideas/index', {
                ideas
            })
        })
})
router.post('/', (req, res) => {
    let errors = []

    if (!req.body.title) {
        errors.push({
            text: 'Please add a title'
        })
    }

    if (!req.body.details) {
        errors.push({
            text: "Please add some details"
        })
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user._id
        }

        new Idea(newUser)
            .save()
            .then((idea) => {
                console.log(idea)
                res.redirect('/ideas')
            })
    }
})

router.put('/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).then((idea) => {
        idea.title = req.body.title
        idea.details = req.body.details

        idea.save()
            .then((idea) => {
                req.flash('success_msg', 'Video idea updated')
                res.redirect('/ideas')
            })
    })
})

router.delete('/:id', (req, res) => {
    Idea.remove({
            _id: req.params.id
        })
        .then(() => {
            req.flash('success_msg', 'Video idea removed')
            res.redirect('/ideas')
        })
})

const ideasRouter = router
module.exports = ideasRouter