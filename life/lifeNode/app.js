var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var weiXinRoute = require('./routes/weiXinRoute');
var smsRoute = require('./routes/smsRoute');
var appointmentRoute = require('./routes/appointmentRoute');
var customerRoute = require('./routes/customerRoute');
var domainUtils = require('./config/domain');
var app = express();
//var history = require('connect-history-api-fallback');
//app.use(history());

app.use(bodyParser.urlencoded({
	extended: false
})); //post
app.use(bodyParser.json()); //ajax post 
app.use(bodyParser.text({
	type: 'text/xml'
})); //微信支付成功 回调通知
app.use(express.json());
app.use(cookieParser());
// set app trust proxy to get the request ip address
app.set('trust proxy', true);
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1')
	//  if(req.method=="OPTIONS") res.sendStatus(200);/*让options请求快速返回*/
	//  else
	next();
});

/** 接入验证 */
app.get('/auth', weiXinRoute.auth);

app.post('/smsAuth', smsRoute.smsAuth);

app.get('/redirectToArtMuseumCenter', weiXinRoute.redirectToArtMuseumCenter);

app.get('/redirectToCellStorageCenter', weiXinRoute.redirectToCellStorageCenter);

app.post('/getVerifyCode', smsRoute.sendMsgToPlatform);

app.post('/register', smsRoute.checkCodeAndRegister);

app.post('/addCustomerInfo', customerRoute.addCustomerInfo);

app.post('/loadArtMuseumAppointmentList', appointmentRoute.loadArtMuseumAppointmentList);

app.post('/loadCellStorageAppointmentList', appointmentRoute.loadCellStorageAppointmentList);

app.post('/getAppointment', appointmentRoute.getAppointment);

app.post('/deleteAppointment', appointmentRoute.deleteAppointment);

app.post('/addArtMuseumAppointment', appointmentRoute.addArtMuseumAppointment);

//支付預訂單
app.post('/preOrder', weiXinRoute.preOrder);

//支付成功通知
app.post("/wxpay", weiXinRoute.payNotify);

app.post('/addCellStorageAppointment', appointmentRoute.addCellStorageAppointment);

app.post('/updateChargeStatus', appointmentRoute.updateChargeStatus);

app.get("/afterPay",function(req,res){
	res.redirect(domainUtils.domain+"/payment")
})

app.get('/test1', weiXinRoute.test1);
app.get('/test2', weiXinRoute.test2);

app.get('*', (req, res) => {
	res.end('not found !');
})



process.on('uncaughtException', function(err) {
	console.log(err)

}) 

process.on('unhandledRejection', function(err, promise) {
	console.log(err)
}) 

//強制ipv4
app.listen('3000', "0.0.0.0", function() {
	console.log('3000');
})