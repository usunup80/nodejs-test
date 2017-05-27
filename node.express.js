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

    var dateList = [];
    var day = new Date('2017-03-01');
    for(var i=0; i<21; i++){
        var formattedDate = getFormattedDate(day);

        console.log(formattedDate);
        dateList.push(formattedDate);
        day.setDate(day.getDate()+1);
    }

    fs.readFile('list.html', 'utf-8', function(error, data) {
        var aStudent = null;
        client.query('select * from tb_student', function(error, results){
            aStudent = results;
        });

        query = 'select attendance_date, student_num from tb_attendance_book ab';
        client.query(query, function(error, results){
            var oResult = {};
            results.forEach(function (item, index){
                //console.log(item.student_num, item.attendance_date);

                var studentNum = item.student_num;
                var attendanceDate = getFormattedDate(item.attendance_date);
                if(!(attendanceDate in oResult)){
                    oResult[attendanceDate] = [];
                }
                oResult[attendanceDate].push(studentNum);
            });

            console.log(oResult);

            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8'});
            response.end(ejs.render(data, {
                data: oResult,
                dateArr : dateList,
                students: aStudent
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

function getFormattedDate(day){
    var nMonth = day.getMonth()+1;
    var sMonth = nMonth < 10 ? '0'+nMonth: nMonth;
    var sDate = day.getDate() < 10 ? '0'+day.getDate(): day.getDate();
    var formattedDate = day.getFullYear()+'-'+sMonth+'-'+sDate;
    return formattedDate;
}