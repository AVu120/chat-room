const http = require("http");
var createError = require("http-errors");
var express = require("express");
const socketio = require("socket.io");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var usersRouter = require("./routes/users");
var messagesRouter = require("./routes/messages");
const cors = require("cors");

var app = express();
const server = http.createServer(app);
const io = socketio(server);
const { db } = require("./services/firebase");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/users", usersRouter);
app.use("/messages", messagesRouter);

io.on("connect", (socket) => {
  db.ref("messages").on("value", (node) => {
    try {
      // If there are messages, save them into state as an array of objects.
      if (node.val()) setMessages(Object.values(node.val()));
      else {
        setMessages([]);
        throw new Error("There are no messages yet!");
      }
    } catch (readError) {
      setReadError(readError.message);
    }
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
