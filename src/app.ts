var express = require('express');
var http = require('http');
var app = express();

app.set('port', process.env.PORT || 5000);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api/index');

//request 요청 URL과 처리 로직을 선언한 라우팅 모듈 매핑
app.use('/', indexRouter);

app.use('/api', apiRouter);