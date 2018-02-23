var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

//mysql connection
var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    start();
});

//start screen table and asks user to continue
var start=function(){
    connection.query("SELECT * FROM products", function(err, results) {
      if (err) throw err;
      var table = new Table({
          head: ['Item ID', 'Item Name','Price']
      });


      for (var i=0; i<results.length; i++){
        table.push(
          [results[i].item_id, results[i].product_name,results[i].price]
          );
      }

      console.log(table.toString());

      inquirer.prompt([
        {
          message:"Would you like to place an order?",
          type:"confirm",
          name:'go',
          default:true
        }
      ]).then(function(response){
        if(response.go!==true){
            console.log("Alright. Come back soon!");
            connection.end();
        }
        else{
          order();
        }
      });
      });
    };

//this allows user order and updates order
var order=function(){
      connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

          inquirer.prompt([
            {
              message:"Please type the ID of the product you would like to purchase.",
              type:"input",
              name:"selectID",
              validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
              }
            },{
              message:"How many would you like to purchase?",
              type:"input",
              name:"quantID",
              validate: function(value) {
                if (isNaN(value) === false) {
                return true;
                }
                return false;
              }
            }
          ]). then (function(response1){
            var chosenItem=0;
            var userQuant=parseInt(response1.quantID);
            var userID=parseInt(response1.selectID);
                for (var i = 0; i < results.length; i++) {
                if (results[i].item_id === userID) {
                    chosenItem = results[i];
                  }
              }

//will make user choose available id
              if(chosenItem===0){
                console.log("ID not found. Please choose an ID listed in table");
                order();
                //out of stock warning
              } else if(userQuant>chosenItem.stock_quantity){
                console.log("This is embarassing :( we are out of stock.");
                setTimeout(function() {
                  start();
                  }, 2000);
                //process order and updates database
              } else if(userQuant <= chosenItem.stock_quantity){
                var newquant=chosenItem.stock_quantity-userQuant;
                var newsales=chosenItem.product_sales+(userQuant*chosenItem.price);
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity: newquant,
                        product_sales:newsales
                      },
                      {
                        item_id: chosenItem.item_id
                      }
                    ],
                    function(error) {
                      if (error) throw err;
                      console.log("Great! We will get that to you ASAP.");
                      setTimeout(function() {
                        start();
                        }, 2000);
                    }
                  );
              }
          });
        });
      };
