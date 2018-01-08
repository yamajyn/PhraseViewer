var mysql = require('mysql');

if(process.env.NODE_ENV === "production" ){
  //リリース用
  var dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'tateWEB',
    charset : 'utf8mb4',
    multipleStatements: true
  };
  connection = mysql.createConnection(dbConfig);
  connection.connect(function(err) {
    if (err) {
      console.error('Can not connect RDS mysql server: ' + err.stack);
      return;
    }else{
      console.log("SUCSESS CONNECT SERVER DB");
    }
  });
}else{
  //ローカル用
  var dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'tateWEB',
    charset : 'utf8mb4',
    multipleStatements: true
  };
  connection = mysql.createConnection(dbConfig);
  connection.connect(function(err) {
    if (err) {
      console.error('Can not connect local mysql.server: ' + err.stack);
      return;
    }else{
      console.log("SUCSESS CONNECT LOCAL DB");
    }
  });
}


// これはHerokuのMySQLのためのハックです。
setInterval(function() {
  connection.query('SELECT 1');
}, 5000);

module.exports = connection;
