const mongoose = require('mongoose')


// Map global promise to get rid of warning
mongoose.Promise = global.Promise

// Connect to mongoose
mongoose.connect(process.env.MONGODB_URI, {
        useMongoClient: true
    })
    .then(() => {
        console.log('MongoDB Connected...')
    })
    .catch((err) => {
        console.log(err)
    })

module.exports = mongoose