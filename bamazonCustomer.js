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
    //console.log("Connection successful!"); 

});

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
start();



//connection takes place and the items are listed 
//the user is prompted to choose from a list of IDs 
//the user is also prompted to choose a quantity 
//if there's a suffice quantity, the database sends a query that updates based on the user's choice
//if there isn't a suffice quantity, the code returns insufficient quanity, and rerun the inquirer.
//if there is, update the amount in the database and inform the user that the transation was successful 

var buyRequest = function() {

    connection.query("SELECT * from products", function(err, results){
        if(err) throw err; 
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
                if(results[i].product_name === answer.itemChoices) {
                currentQuantity = results[i].stock_quantity - answer.quantity;
                }
            }
            console.log(currentQuantity);

             connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: currentQuantity
                }, {
                    product_name: answer.itemChoices
                }], function(error) {
                    if (error) throw err;
                    console.log("You've puchased this item!"); 
                    start();
                });       
        });
    });
};
//buyRequest();