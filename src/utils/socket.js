import { io } from "socket.io-client";
import API_BASE from "./api.js";

const createSocket = () => {
  return io(API_BASE, {
    withCredentials: true,
    transports: ["polling", "websocket"],
    autoConnect: true,
  });
};

export default createSocket;
