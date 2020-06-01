var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  // password: 'FeminSomilSaarthak@2020',
  database : 'stock_game'
});
 
connection.connect();

module.exports = connection;


/*
MYSQL DATA : 
$user = 'root';
$password = 'root';
$db = 'inventory';
$host = 'localhost';
$port = 3306;
*/