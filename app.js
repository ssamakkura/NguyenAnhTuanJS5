var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose'); // Chỉ khai báo 1 lần duy nhất ở đây

var app = express();
const uri = "mongodb+srv://tuantuntun03:0939139719Tt@cluster0.qvabg.mongodb.net/tuanahn?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => {
    console.log("--- Kết nối MongoDB Atlas thành công! ---");
    console.log("Đang sử dụng database: tuanahn");
  })
  .catch((err) => {
    console.error("Lỗi kết nối Atlas:", err.message);
  });

// 2. View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 3. Định nghĩa Routes
app.use('/', require('./routes/index'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/categories', require('./routes/categories'));

// 4. Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// 5. Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;