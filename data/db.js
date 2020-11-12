const mongoose = require('mongoose')

const MONGO_URI ="mongodb://localhost/userregistrationddb"
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })

        console.log(`MongoDB connected to: ${conn.connection.host}`)
    }
    catch (err) {
        console.error(err)
        process.exit(`1`)
    }
}

module.exports = connectDB