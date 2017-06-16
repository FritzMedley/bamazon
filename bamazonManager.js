var mysql = require("mysql"); 
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306, 
    user: "root",
    password: "", 
    database: "Bamazon"
}); 

var makeTable = function() {
    //Selects all of the data from the MySQL products table 
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err; 

       for (var i = 0; i < res.length; i++) {
           console.log(res[i].product_name);
       }
    });
    promptManager(res);
}; 

function promptManager(res) {
    inquirer.prompt([
        {
            type: "rawlist". 
            name: "choice",
            message: "What would you like to do?",
            choices: ["Add Item", "Add Quantity"]
        }
    ]).then(function(val){
        if (val.choice === "Add Item") {
            addItem();
        }
        if (val.choice === "Add Quanity") {
            addQuantity();
        }
    });
}

makeTable();