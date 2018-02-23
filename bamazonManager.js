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
    firstPrompt();
});

function firstPrompt() {
    inquirer.prompt([
      {
      name: "mgrList",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Products", "View Low Inventory",
                "Add to Inventory","Add New Product"]
    }
  ]).then(function(answer) {

      switch(answer.mgrList){

        case "View Products":
          prodView();
          break;

        case "View Low Inventory":
          lowInv();
          break;

        case "Add to Inventory":
          addInv();
          break;

        case "Add New Product":
          newProd();
          break;
        // default to rendering index.html, if none of above cases are hit
        default:
          console.log("Something went wrong");
      }
    });
}

function mainMenu(){
  inquirer.prompt([
    {
      message:"Would you like to return to the Main Menu?",
      type:"confirm",
      name:'go',
      default:true
    }
  ]).then(function(response){
    if(response.go!==true){
        console.log("Exiting the program now.");
        connection.end();
    }
    else{
      firstPrompt();
    }
  });
}

function prodView(){
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    var table1 = new Table({
        head: ['Item ID', 'Item Name','Dept','Price','Quantity']
    });

    for (var i=0; i<results.length; i++){
      table1.push(
        [results[i].item_id, results[i].product_name,results[i].department_name,
        results[i].price,results[i].stock_quantity]
        );
    }

    console.log(table1.toString());
    mainMenu();
});
}

function lowInv(){
  connection.query("SELECT * FROM products WHERE stock_quantity<5", function(err, results) {
    if (err) throw err;

    var table2 = new Table({
        head: ['Item ID', 'Item Name','Dept','Price','Quantity']
    });

    for (var i=0; i<results.length; i++){
      table2.push(
        [results[i].item_id, results[i].product_name,results[i].department_name,
        results[i].price,results[i].stock_quantity]
        );
    }

    console.log(table2.toString());
    mainMenu();
});
}

function addInv(){
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    inquirer.prompt([
      {
        message:"Please type the ID of the product whose inventory you are adding to.",
        type:"input",
        name:"selectID",
        validate: function(value) {
          if (isNaN(value) === false) {
          return true;
          }
          return false;
        }
      },{
        message:"How many are you adding to the Inventory?",
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
          addInv();
          //adds Inventory
        }  else{
          var newquant=chosenItem.stock_quantity+userQuant;
          connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: newquant
                },
                {
                  item_id: chosenItem.item_id
                }
              ],function(error) {
                if (error) throw err;
                console.log(chosenItem.product_name+"'s inventory: "+newquant);
                  mainMenu();
              }
            );
        }
      });
    });
  }

function newProd(){
  inquirer.prompt([
      {
          message:"Enter the Product Name",
          name:"name",
          type:"input",
          validate: function(value){
            if (value == "") {
            return false;
            }
            return true;
          }
      },{
          message:"Enter the Product's Department",
          name:"dept",
          type:"input",
          validate: function(value){
            if (value == "") {
            return false;
            }
            return true;
          }
      },{
          message:"Enter the Product's Price",
          name:"price",
          type:"input",
          validate: function(value) {
            if (isNaN(value) === false) {
            return true;
            }
            return false;
          }
      },{
        message:"Enter the Quantity of Product",
        name:"quantity",
        type:"input",
        validate: function(value) {
          if (isNaN(value) === false) {
          return true;
          }
          return false;
        }
      }
  ]).then(function(answer) {
    var query = connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: answer.name,
        department_name: answer.dept,
        price: answer.price,
        stock_quantity:answer.quantity
      });
        console.log("You have updated your products.");
        prodView();
  });
}
