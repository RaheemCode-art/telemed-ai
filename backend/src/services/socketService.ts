import { Server as SocketIOServer, Socket } from 'socket.io';
import Message from '../models/Message';

export const initializeSocket = (io: SocketIOServer): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`Client Connected: ${socket.id}`);

    socket.on('join_room', (roomId: string, userId?: string) => {
      socket.join(roomId);
      if (userId) {
        socket.to(roomId).emit('user_connected', userId);
      }
    });

    socket.on('send_message', async (data: { roomId: string; sender: string; text: string; timestamp?: string }) => {
      socket.to(data.roomId).emit('receive_message', data);

      try {
        await Message.create({
          appointmentId: data.roomId,
          sender: data.sender,
          text: data.text,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        
        console.log("Message successfully saved to database");
      } catch (error) {
        console.error("Failed to save message to database:", error);
      }
    });

    socket.on('call-user', (data: { userToCall: string; signalData: any; from: string; name: string }) => {
      io.to(data.userToCall).emit('call-made', { signal: data.signalData, from: data.from, name: data.name });
    });

    socket.on('answer-call', (data: { to: string; signal: any }) => {
      io.to(data.to).emit('call-answered', data.signal);
    });

    socket.on('send-ice-candidate', (data: { target: string; candidate: any }) => {
      io.to(data.target).emit('receive-ice-candidate', data.candidate);
    });

    socket.on('end-call', (roomId: string) => {
      socket.to(roomId).emit('call-ended');
    });

    socket.on('disconnect', () => {
      console.log(`Client Disconnected: ${socket.id}`);
    });
  });
};