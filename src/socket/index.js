import { Server } from 'socket.io';
import * as companyService from '../services/company.service.js';
import * as driverService from '../services/driver.service.js';
import mongoose from 'mongoose';
import { createSocketChat } from '../services/chat.service.js';

let io;

const mongoDBRandomId = function () {
  var timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
  return (
    timestamp +
    'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, function () {
        return ((Math.random() * 16) | 0).toString(16);
      })
      .toLowerCase()
  );
};

const initializeSocketIO = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });
  let rooms = [];
  // let messages = [];
  io.on('connection', (socket) => {
    socket.emit('connected', {
      message: 'You are connected to the socket server',
    });

    // Handle socket events here

    console.log('New user connected:', socket.id);

    // Driver-Company Chat
    socket.on('driver-company-chat', async (data) => {
      const { driverId, companyId, sendBy, message, attachment } = data;
      try {
        const driver = await driverService.findById(driverId);
        const company = await companyService.findById(companyId);
        if (!driver || !company) {
          console.log('Invalid driver or company ID');
          return;
        }

        const roomId = `${companyId}_${driverId}`;
        if (rooms.find((e) => e.roomId == roomId)) {
          let roomMessages = rooms.find((e) => e.roomId == roomId);
          let messages = roomMessages.messages;
          let msg = {
            sender: sendBy === 'company' ? companyId : driverId,
            message,
            attachment,
            createdAt: new Date(),
            isRead: false,
          };
          attachment ? { ...msg, attachment } : msg;

          messages ? messages.push(msg) : (messages = [msg]);

          console.log('newMessages:', messages);
          rooms = [
            {
              ...rooms.find((e) => e.roomId == roomId),
              messages: messages,
            },
          ];
          console.log('rooms after:', JSON.stringify(rooms));
        }
        let id = mongoDBRandomId();

        io.to(roomId).emit('driver-company-chat', {
          success: true,
          sendBy,
          message,
          id,
          roomId,
          attachment: attachment ? attachment : false,
        });
      } catch (error) {
        console.log(error);
      }
    });

    // Join Room
    socket.on('join-room', ({ sender, receiver }) => {
      rooms.push({ roomId: `${sender}_${receiver}` });
      socket.join(`${sender}_${receiver}`);
    });

    // Leave Room
    socket.on('leave-room', async ({ sender, receiver }) => {
      console.log(`User ${sender} left the ${receiver} room`);
      const roomId = `${sender}_${receiver}`;

      let data = rooms.find((e) => e.roomId === roomId);
      data = {
        ...data,
        company: mongoose.Types.ObjectId(sender),
        driver: mongoose.Types.ObjectId(receiver),
      };
      if (data) {
        await createSocketChat(data);
      }
      rooms = rooms.filter((e) => e.roomId !== roomId);
      socket.leave(`${sender}_${receiver}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

const getSocketIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }

  return io;
};

export { initializeSocketIO, getSocketIO };
