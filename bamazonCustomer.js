//you're requiring what you need from the packages
var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306, 
    user: "root",
    password: "", 
    database: "Bamazon"
}); 

connection.connect(function(err){
   if(err) throw err;
    console.log("Connection successful!"); 
});

//initializing the application to run what you need
var start = function() {
    //You need to first prompt the user to send a function with call
    inquirer.prompt([{
        name: "start",
        type: "confirm",
        message: "Welcome! Would you like to buy an item from my store?"
    }]).then(function(answer){
        if(answer.start) {
            buyRequest();
        }
        else {
            console.log("Thank you for coming to our store! Come back next time!"); 
            start();
        }
    })
}

var buyRequest = function() {

    connection.query("SELECT * from products", function(err, results){
        //get a list of items from the database
        if(err) throw err; 
        //ask the user to select which item he would like to puchase, and what quantity.
        inquirer.prompt([
            {
            name: "itemChoices",
            type: "rawlist",
            message: "What item would you like to buy?",
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < results.length; i++) {
                    choiceArray.push(results[i].product_name);
                }             
                return choiceArray;
            }                        
            }, {
             name: "quantity", 
             type: "input", 
             message: "How many of these do you want to buy?",
             validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
             }
            }
        ]).then(function(answer) {
            var currentQuantity;
            for (var i = 0; i < results.length; i++) {
            //set the conditional to pull from the database if the item choices are less
                if(results[i].product_name === answer.itemChoices && results[i].stock_quantity > answer.quantity) {
                currentQuantity = results[i].stock_quantity - answer.quantity;
                connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: currentQuantity
                }, {
                    product_name: answer.itemChoices
                }], function(error) {
                    if (error) throw err;
                    console.log("You purchased the items!");
                    currentQuantity = 0;
                    start();
                });                
                }
            //if the quantity requested is higher than the stock, return the user to the beginning.
                else if (results[i].product_name === answer.itemChoices && results[i].stock_quantity < answer.quantity) {    
                    console.log("Sorry! There isn't enough of the item available. Please try again with a different amount!");
                    start();
                }
            }      
         });
    });
};
start();
