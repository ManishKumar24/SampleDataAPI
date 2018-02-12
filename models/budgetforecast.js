var mongoose     = require('mongoose');
var chalk = require('chalk');
var Schema       = mongoose.Schema;

//var dbURI = 'mongodb://dbadmin:dbadmin@ds123718.mlab.com:23718/dataapi';
//mongoose.connect(dbURI);

//mongoose.connection.on('connected', function () {
    //console.log(chalk.yellow('Mongoose connected to ' + dbURI));
  //});
  
  //mongoose.connection.on('error',function (err) {
    //console.log(chalk.red('Mongoose connection error: ' + err));
  //});
  
  //mongoose.connection.on('disconnected', function () {
    //console.log(chalk.red('Mongoose disconnected'));
  //});

var BudgetForeCastSchema   = new Schema({      
    station_call_letters: String,
    year: Number,
    month: Number,
    pricing_budget_group: String,
    budget_update_date: Date,
    forecast_date: Date,
    budget_amount: Number,
    forecast_amount: Number
});

BudgetForeCastSchema.index({station_call_letters: 1, year: 1, month: 1, pricing_budget_group: 1}, {unique: true});
module.exports = mongoose.model('BudgetForeCast', BudgetForeCastSchema);
