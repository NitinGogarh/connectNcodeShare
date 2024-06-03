import { io, Socket } from "socket.io-client";

const REACT_BACKEND_URL = "wss://connect-n-code.vercel.app/";

export const initSocket = async():Promise<Socket>=>{
    const options = {
        'force new connection':true,
        timeout:10000,
        transports:['websocket'],
        reconnectionAttemps:'infinity'
    }
    return  io(REACT_BACKEND_URL,options)
} 