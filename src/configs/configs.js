require("dotenv/config")

module.exports = {
    database: {
        mysql: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
        }
    },
    database_payment: {
        mysql: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database: "payment_gateway"
        }
    },
    database_marlinda: {
        mysql: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database: "rakhsa"
        }
    },
    database_lingkunganku: {
        mysql: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database: "lingkunganku_dev"
        }
    },
    database_atj: {
        mysql: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            database: "community_atj"
        }
    },
    port: process.env.PORT
}