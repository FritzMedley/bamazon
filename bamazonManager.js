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
    ]).then(function(val) {
        if (val.choice === "Add Item") {
            addItem();
        }
        if (val.choice === "Add Quanity") {
            addQuantity();
        }
    });
}

function addItem() {
    inquirer.prompt() ([
        {
            type: "input",
            name: "productName",
            message: "What is the name of the product?"
        }, {
            type: "input",
            name: "price",
            message: "What is the price of the item?"
        }, {
            type: "input",
            name: "departmentName",
            message: "Which department would you like to place this in?"
        }, {
            type: "input",
            name: "quantity",
            message: "How many are available?"
        }
    ]).then(function(val){
        connection.query("INSERT INTO products (product_name, price, department_name, stock_quantity) VALUES ('" + val.productName + "'," + val.price, + ",'" + val.departmentName + "'," + val.quantity + ");", function(err, res) {
            if (err) throw err;
            console.log("Item added to Bamazon!");
            makeTable();
        });
    });
}

function addQuantity() {
    inquirer.prompt([
        {
            type: input,
            name: "product",
            message: "Which product would you like to update?"
        },
        {
            type: input,
            name: "addQuantity",
            message: "How many of this product would you like to add?"
        }
    ]).then(function(val){
        connection.query("UPDATE products SET stock_quantity = stock_quantity+" +
	      val.addQuantity + " WHERE product_name='" + val.product + "'",
            function(err, res){
                if (err) throw err;
                 if (res.affectedRows === 0) {
              console.log("Item doesn't exist. Please select another.");
    	          makeTable();
    	        }
    	        else {
    	          console.log("Items have been added to the inventory!");
    	          makeTable();
    	        }
            }
        )
      })
};


makeTable();
