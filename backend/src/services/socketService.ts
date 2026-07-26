import { Server as SocketIOServer, Socket } from 'socket.io';

export const initializeSocket = (io: SocketIOServer): void => {
  io.on('connection', (socket: Socket) => {
    console.log(`Client Connected: ${socket.id}`);

    socket.on('join-room', (roomId: string, userId: string) => {
      socket.join(roomId);
      socket.to(roomId).emit('user-connected', userId);
    });

    socket.on('send-message', (data: { roomId: string; sender: string; message: string; timestamp: string }) => {
      io.to(data.roomId).emit('receive-message', data);
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