const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const chatRoutes =
  require("./routes/chatRoutes");

dotenv.config();

const app = express();


// =====================================
// MIDDLEWARE
// =====================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());


// =====================================
// ROUTES
// =====================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/posts",
  postRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);


// =====================================
// BASIC ROUTE
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Social Media API is running",
  });
});


// =====================================
// HTTP SERVER
// =====================================

const server =
  http.createServer(app);


// =====================================
// SOCKET.IO
// =====================================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);


// =====================================
// SOCKET CONNECTION
// =====================================

io.on("connection", (socket) => {
 // USER JOINS HIS OWN ROOM

  socket.on(
    "join",
    (userId) => {

      if (!userId) return;

      socket.join(
        userId.toString()
      );

      console.log(
        `User ${userId} joined room`
      );

    }
  );


  // DISCONNECT

  socket.on(
    "disconnect",
    () => {

    }
  );

});


// =====================================
// DATABASE
// =====================================

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {

    console.log(
      "MongoDB Connected"
    );


    // START SERVER

    server.listen(
      process.env.PORT || 5000,
      () => {

        console.log(
          `Server running on port ${
            process.env.PORT || 5000
          }`
        );

      }
    );

  })
  .catch((error) => {

    console.error(
      "MongoDB Connection Error:",
      error
    );

  });