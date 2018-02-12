var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var chalk = require('chalk');
var mongoose = require('./models/connection');

// configure app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//connect mongodb
mongoose.connect();
//mongoose.disconnect();

var port = process.env.PORT || 8080;

var router = express.Router();

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}

var BudgetForeCast = require('./models/budgetforecast');
router.use(function (req, res, next) {    
        var _send = res.send;
        var sent = false;
        res.send = function (data) {
            if (sent) return;
            _send.bind(res)(data);
            sent = true;
        };
        // do logging
        console.log('Something is happening.');
        next(); // make sure we go to the next routes and don't stop here
    });


    // Create a budgetforecast row (accessed at POST http://localhost:8080/api/budgetforecast/create)
    router.route('/budgetforecast/create')
        .post(function (req, res) {

            var budgetForeCast = new BudgetForeCast();
            // set the values (comes from the request body)
            budgetForeCast.station_call_letters = req.body.station_call_letters;
            budgetForeCast.year = req.body.year;
            budgetForeCast.month = req.body.month;
            budgetForeCast.pricing_budget_group = req.body.pricing_budget_group;
            budgetForeCast.budget_update_date = req.body.budget_update_date;
            budgetForeCast.forecast_date = req.body.forecast_date;
            budgetForeCast.budget_amount = req.body.budget_amount;
            budgetForeCast.forecast_amount = req.body.forecast_amount;

            // save the row and check for errors
            budgetForeCast.save(function (err) {
                if (err)
                    handleError(res, err.message, 'Error in Creating BudgetForecast Row');

                res.status(201).json({ message: 'BudgetForeCast Row created!' });
            });
        });

    //Delete BudgetForecast row by id (accessed at DELETE http://localhost:8080/api/budgetforecast/delete/:budgetforecastid)

    router.route('/budgetforecast/delete/:budgetforecastid')
        .delete(function (req, res) {
            BudgetForeCast.remove({
                _id: req.params.budgetforecastid
            }, function (err, budgetforecast) {
                if (err) handleError(res, err.message, 'Error in deleting Row.');
                res.status(204).json({
                    message: 'row deleted'
                });
            });
        });

    // Get All BudgetForeCast rows (accessed at GET http://localhost:8080/api/budgetforecasts)
    router.route('/budgetforecasts')
        .get(function (req, res) {
            BudgetForeCast.find(function (err, budgetforecasts) {
                if (err)
                    handleError(res, err.message, 'Error in getting BudgetForecast Rows');
                res.status(200).json(budgetforecasts);
            });
        });

    // Find BudgetForecast row by id (accessed at GET http://localhost:8080/api/budgetforecast/:budgetforecastid)
    router.route('/budgetforecast/:budgetforecastid')
        .get(function (req, res) {
            BudgetForeCast.findById(req.params.budgetforecastid, function (err, budgetforecast) {
                if (err)
                    handleError(res, err.message, 'Error in getting row for Id :' + req.params.budgetforecastid);
                res.status(200).json(budgetforecast);
            });
        });

    // Update budgetforecast row  by id (accessed at PUT http://localhost:8080/api/budgetforecast/update/:budgetforecastid)
    router.route('/budgetforecast/update/:budgetforecastid')
        .put(function (req, res) {
            BudgetForeCast.findById(req.params.budgetforecastid, function (err, budgetforecast) {

                if (err)
                    handleError(res, err.message, 'Error in getting row for Id :' + req.params.budgetforecastid);
                budgetforecast.station_call_letters = req.body.station_call_letters;
                budgetforecast.year = req.body.year;
                budgetforecast.month = req.body.month;
                budgetforecast.pricing_budget_group = req.body.pricing_budget_group;
                budgetforecast.budget_update_date = req.body.budget_update_date;
                budgetforecast.budget_amount = req.body.budget_amount;
                budgetforecast.forecast_date = req.body.forecast_date;
                budgetforecast.forecast_amount = req.body.forecast_amount;
                budgetforecast.save(function (err) {
                    if (err)
                        handleError(res, err.message, 'Error in updating row for Id :' + req.params.budgetforecastid);
                    res.status(204).json({ message: 'BudgetForeCast updated!' });
                });
            });
        });

    router.get('/', function (req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    app.use('/api', router);

     app.use(function (req, res) {
        console.log(chalk.red("Error: 404"));
        res.status(404).render('404');
        next();
    });
    
    app.use(function (error, req, res, next) {
        console.log(chalk.red('Error : 500' + error))
        res.status(500).render('500');
        next();
    }); 

    // START THE SERVER
    // =============================================================================
    app.listen(port);
    console.log(chalk.green('catch the action at : localhost:' + port));