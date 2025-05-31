import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  withCredentials: true,
  transports: ['websocket']
});

// Check immediately (though it might be false until the connection is established)
console.log('Initial socket.connected:', socket.connected);

// Listen for connect event
socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

// Listen for disconnect event
socket.on('disconnect', (reason) => {
  console.log('❌ Socket disconnected. Reason:', reason);
});


export const joinRoom = (roomId: string) => {
    socket.emit('joinRoom', { roomId });
  };
  
export const sendMessage = (roomId: string, sender: string, message: string) => {
socket.emit('sendMessage', { roomId, sender, message });
};

export const onReceiveMessage = (cb: (data: any) => void) => {
socket.on('receiveMessage', cb);
};

export const offReceiveMessage = () => {
socket.off('receiveMessage');
};


export default socket;
