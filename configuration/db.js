const dbConfig = () => {
    return {
        "useDev": true,
        "development": {
            "host": "localhost",
            "username": process.env.USERNAME,
            "password": process.env.DEV_PASS,
            "database": "db_dev",
            "port": 5432,
            "dialect": "postgres"
        },
        "production": {
            "host": "65.20.80.168",
            "username": "root",
            "password": process.env.PROD_PASS,
            "database": "db_prod",
            "port": 5432,
            "dialect": "postgres"
        },
        "env": {
            "use_env_variable": false
        }
    }
}

module.exports = {dbConfig}