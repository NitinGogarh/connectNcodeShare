import { config } from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { ACTIONS } from "./Action";

type Imap = {
  [key: string]: string;
};

const app = express();
const server = http.createServer(app);
config();
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap: Imap = {};
const getAllConnectedClients = (roomId: string) => {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (room)
    return Array.from(room).map((socketId) => {
      return {
        socketId,
        userName: userSocketMap[socketId],
      };
    });
  return [];
};

app.get("/", (req, res) => {
  res.send("Server is running fine");
});

io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
  socket.on(ACTIONS.JOIN, ({ roomId, userName }) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    io.to(roomId).emit(ACTIONS.JOINED, {
      clients,
      userName,
      socketId: socket.id,
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.to(roomId).emit(ACTIONS.CODE_CHANGE, {
      code,
    });
  });
  socket.on(ACTIONS.LANG_CHANGE, ({ lang, roomId }) => {
    socket.to(roomId).emit(ACTIONS.LANG_CHANGE, {
      lang,
    });
  });
  socket.on(ACTIONS.INPUT_CHANGE, ({ value, roomId }) => {
    socket.to(roomId).emit(ACTIONS.INPUT_CHANGE, {
      value,
    });
  });
  socket.on(ACTIONS.OUTPUT_CHANGE, ({ value, roomId, error }) => {
    socket.to(roomId).emit(ACTIONS.OUTPUT_CHANGE, {
      value,
      error,
    });
  });

  socket.on(ACTIONS.SET_LOADING, ({ value, roomId }) => {
    socket.to(roomId).emit(ACTIONS.SET_LOADING, {
      value,
    });
  });
  socket.on(ACTIONS.SYNC_CODE, ({ code, socketId, lang, input, output }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
      code,
    });
    io.to(socketId).emit(ACTIONS.LANG_CHANGE, {
      lang,
    });
    io.to(socketId).emit(ACTIONS.INPUT_CHANGE, {
      value: input,
    });
    io.to(socketId).emit(ACTIONS.OUTPUT_CHANGE, {
      value: output.value,
      error: output.error,
    });
  });

  socket.on(ACTIONS.SEND_MSG, ({ msg, RoomId, userName }) => {
    socket.to(RoomId).emit(ACTIONS.RECEIVE_MSG, { msg, userName });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.to(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });

      socket.leave(roomId);
    });
    delete userSocketMap[socket.id];
  });
});

const PORT: string | undefined = process.env.PORT;

server.listen(PORT || "8000", () => {
  console.log(`server started at port ${PORT} `);
});
