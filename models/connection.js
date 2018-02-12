var mongoose = require('mongoose');
var chalk = require('chalk');
var Schema = mongoose.Schema;

var dbURI = 'mongodb://dbadmin:dbadmin@ds123718.mlab.com:23718/dataapi';

//var conn = mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log(chalk.yellow('Mongoose connected to ' + dbURI));
});

mongoose.connection.on('error', function (err) {
    console.log(chalk.red('Mongoose connection error: ' + err));
});

mongoose.connection.on('disconnected', function () {
    console.log(chalk.red('Mongoose disconnected'));
});

function connect(){
    mongoose.connect(dbURI);    
    console.log("Database connection ready");    
}
function disconnect(){
    mongoose.disconnect(dbURI);
    console.log("Database disconnected");
}

module.exports = {
    connection: mongoose.connection,
    connect: function () {
        connect();        
    },
    disconnect: function () {
        disconnect();
        
    }    
};
