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
   if(err) throw err 
}); 

var start = function() {
//display all the items at first.
    connection.query("SELECT * FROM products", function(err, results) {
        if(err) throw err;
        console.log(results);
    }); 
}; 

start(); 