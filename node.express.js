var fs = require('fs');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var express = require('express');
var mysql = require('mysql');

var client = mysql.createConnection({
    user: 'root',
    password: 'root',
    database: 'db_student'
});

var app = express();

// app.use(function (request, response){
//     response.send([{'id': 1, 'name': '이영훈'},{'id': 2, 'name': '장재혁'}]);
// });

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/list', function (request, response){
    var arr = [{'id': 3, 'name': '이영훈'},{'id': 4, 'name': '장재혁'}];
    arr.forEach(function (item, index) {
        console.log(item);
    });

    fs.readFile('list.html', 'utf-8', function(error, data) {
        client.query('SELECT * FROM tb_student', function(error, results){
            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
            response.end(ejs.render(data, {
                data: results
            }));
        });
    });

});

app.post('/attend/:id', function (request, response){
    var id = request.params.id;

    response.send(id);
});

var port = 52273;
app.listen(port, function() {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});