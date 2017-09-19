let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');

// PROXY
let httpProxy = require('http-proxy');

let app = express();

// PROXY TO API
const apiProxy = httpProxy.createProxyServer({
	target: 'http://localhost:3001'
});
app.use('/api', (req, res) => {
	apiProxy.web(req, res);
});

apiProxy.on('error', function(error) {
	console.log(error);
});
// END PROXY

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
