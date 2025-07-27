import { getUserDetails } from "@/lib/utils";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL!, {
  query: { userId: getUserDetails()?.id },
  withCredentials: true,
  transports: ["websocket"],
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

export const joinRoom = (roomId: string) => {
  socket.emit("joinRoom", { roomId });
};

export const sendMessage = (
  roomId: string,
  receiverId: string,
  senderId: string,
  message: string
) => {
  console.log("📤 Sending message:", { roomId, receiverId, senderId, message });
  socket.emit("sendMessage", { roomId, receiverId, senderId, message });
};

export const onReceiveMessage = (cb: (data: any) => void) => {
  socket.on("receiveMessage", cb);
};

export const offReceiveMessage = () => {
  socket.off("receiveMessage");
};

export default socket;
