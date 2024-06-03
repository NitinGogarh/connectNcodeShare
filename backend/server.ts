import { config } from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { ACTIONS } from "./Action";
import cors from 'cors';

type Imap = {
  [key: string]: string;
};

config();

const app = express();

// Apply CORS middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const userSocketMap: Imap = {};

const getAllConnectedClients = (roomId: string) => {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (room) {
    return Array.from(room).map((socketId) => ({
      socketId,
      userName: userSocketMap[socketId]
    }));
  }
  return [];
};

app.get('/', (req, res) => {
  res.send("Server is running fine");
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    io.to(roomId).emit(ACTIONS.JOINED, {
      clients,
      userName,
      socketId: socket.id
    });
    console.log(`${userName} joined room: ${roomId}`);
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Other event handlers...

  socket.on(ACTIONS.SEND_MSG, ({ msg, RoomId, userName }) => {
    socket.to(RoomId).emit(ACTIONS.RECEIVE_MSG, { msg, userName });
  });

  socket.on('disconnecting', () => {
    console.log(`User disconnecting: ${socket.id}`);
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        userName: userSocketMap[socket.id]
      });

      socket.leave(roomId);
    });
    delete userSocketMap[socket.id];
  });

  socket.on('disconnect', (reason) => {
    console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
  });

  // Heartbeat mechanism
  socket.on('ping', () => {
    console.log(`Ping received from ${socket.id}`);
  });

  socket.on('pong', () => {
    console.log(`Pong received from ${socket.id}`);
  });
});

const PORT: string | undefined = process.env.PORT || "8000";

server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
