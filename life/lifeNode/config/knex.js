const knex = require('knex')({
    client: 'mysql',
    connection: {
//      host: "118.190.146.207",
		host:"101.37.152.94",
        port:"3306",
        user: 'root',
//      password: '',
		password:'',
        database: ''
    },
    pool: { min: 1, max: 7 }
});


module.exports = knex;