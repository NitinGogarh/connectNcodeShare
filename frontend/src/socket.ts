import { io, Socket } from "socket.io-client";
const REACT_BACKEND_URL = "https://connect-n-code.vercel.app/"
export const initSocket = async():Promise<Socket>=>{
    const options = {
        'force new connection':true,
        timeout:10000,
        transports:['websocket'],
        reconnectionAttemp:'infinity'
    }
    return await io(REACT_BACKEND_URL,options)
}