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
      name: "sprList",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Product Sales by Department","Create New Department"]
    }
  ]).then(function(answer) {

      switch(answer.sprList){

        case "View Product Sales by Department":
          prodSales();
          break;

        case "Create New Department":
          newDept();
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

function prodSales(){
  var query1="SELECT a.department_id, a.department_name, a.overhead_costs, SUM(case when b.product_sales is not null then b.product_sales else 0 end) AS deptSales FROM departments AS a LEFT JOIN products AS b ON a.department_name=b.department_name GROUP BY a.department_name ORDER BY a.department_id";
  connection.query(query1,
  function(err, results) {
    if (err) throw err;
    var table1 = new Table({
        head: ['Dept ID', 'Dept Name','Overhead Costs','Product Sales','Total Profits']
    });

    for (var i=0; i<results.length; i++){
      var profit=results[i].deptSales-results[i].overhead_costs;
      table1.push(
        [results[i].department_id, results[i].department_name,
        results[i].overhead_costs,results[i].deptSales,profit]
        );
    }

    console.log(table1.toString());
    mainMenu();
});
}

function newDept(){
  inquirer.prompt([
      {
          message:"Enter the Department Name",
          name:"dname",
          type:"input",
          validate: function(value){
            if (value == "") {
            return false;
            }
            return true;
          }
      },{
          message:"Enter the Overhead Costs",
          name:"costs",
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
      "INSERT INTO departments SET ?",
      {
        department_name: answer.dname,
        overhead_costs: answer.costs,
      });
        console.log("You have updated your departments");
        prodSales();
  });
}
