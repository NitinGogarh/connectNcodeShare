import { io, Socket } from "socket.io-client";
const REACT_BACKEND_URL = "http://localhost:8000/"
export const initSocket = async():Promise<Socket>=>{
    const options = {
        'force new connection':true,
        timeout:10000,
        transports:['websocket'],
        reconnectionAttemp:'infinity'
    }
    return await io(REACT_BACKEND_URL,options)
}