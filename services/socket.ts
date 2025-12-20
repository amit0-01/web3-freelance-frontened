import { getUserDetails } from "@/lib/utils";
import { io } from "socket.io-client";

const socketUrl = 'http://localhost:8000'
  // "http://192.168.31.198:8000";
  //  "https://web3-freelance-backend.onrender.com"
// "https://b6a5d05cfbe5.ngrok-free.app"
const socket = io(socketUrl, {
  query: { userId: getUserDetails()?.id },
  withCredentials: true,
  extraHeaders: {
    'ngrok-skip-browser-warning': 'true'
  },
  transports: ['websocket', 'polling']

});


socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected. Reason:", reason);
});

socket.on('receiveMessage', (data) => {
  console.log("📩 Received message:", data);
});

socket.on('typing', (data) => {
  console.log("✍️ Typing:", data);
});

socket.on('offer', (data) => {
  console.log("🎧 Offer:", data);
});

socket.on('answer', (data) => {
  console.log("🎧 Answer:", data);
});



export const joinRoom = (roomId: string) => {
  socket.emit("joinRoom", { roomId });
};

export const sendMessage = (
  roomId: string,
  receiverId: string,
  senderId: string,
  message: string,
  attachment?: { name: string; type: string; size: number; url: string }
) => {
  socket.emit("sendMessage", { roomId, receiverId, senderId, message, attachment });
};

export const onReceiveMessage = (cb: (data: any) => void) => {
  socket.on("receiveMessage", cb);
};

export const offReceiveMessage = () => {
  socket.off("receiveMessage");
};

export default socket;
