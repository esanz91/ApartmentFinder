module.exports = {
    mongoDB: {
        development: {
            connectionString: 'mongodb://localhost:27017/spotaru'
        },
        test: {
            connectionString: process.env.TEST_DB
        }
    },
    cookie: {
        secret: process.env.COOKIE
    }
}