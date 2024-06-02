import "react-chat-elements/dist/main.css";
import { MessageList } from "react-chat-elements";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import {ACTIONS} from './Action'
type IdataSource = {
  position: string;
  type: string;
  title: string;
  text: string;

};
type Iprops = {
  bodyWidth: number;
  setDisplay: (x: boolean) => void;
  coordinate: { left: number; top: number };
  bodyHeight: number;
  handleDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  socketRef: React.MutableRefObject<Socket | undefined>;
  RoomId:string|undefined,
  userName:string,
  messages:IdataSource[],
  setMessages:React.Dispatch<React.SetStateAction<IdataSource[]>>
};
interface IMsgData{
    msg:string,
    userName:string                                                                                                             
}

const ChatWindow: React.FC<Iprops> = ({
  bodyWidth,
  setDisplay,
  coordinate,
  handleDown,
  bodyHeight,
  socketRef,
  RoomId,
  userName,
  messages,
  setMessages
}) => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [msg, setMsg] = useState("");
  const divRef = useRef<HTMLDivElement>(null);
  
   const msgEndRef = useRef<HTMLDivElement>(null);
  //handlers
  const handleClose = () => {
    setDisplay(false);
  };
 const handleSend = ()=>{
    if(!msg.trim())return;
    const newData:IdataSource = {
        position: "right",
        type: "text",
        title: userName,
        text: msg,
      }
    setMessages((prev)=> [...prev,newData])
      socketRef.current?.emit(ACTIONS.SEND_MSG,{msg,RoomId,userName})
        
        setMsg('')
 }
 const handleMsg = (e:React.ChangeEvent<HTMLInputElement> )=>{    
   setMsg(e.target.value)
 }

  useEffect(() => {
    if (divRef.current) {
      setWidth(divRef.current?.offsetWidth);
      setHeight(divRef.current?.offsetHeight);
    }
  }, [bodyWidth, bodyHeight]);

  useEffect(()=>{
     socketRef.current?.on(ACTIONS.RECEIVE_MSG,(data:IMsgData)=>{
     console.log(data)
      const newData:IdataSource = {
        position: "left",
        type: "text",
        title: data.userName,
        text: data.msg,
      }
    setMessages((prev)=> [...prev,newData])

     })
    return () => {
      socketRef.current?.off(ACTIONS.RECEIVE_MSG);
    };
  },[socketRef.current])

  useEffect(()=>{
     msgEndRef.current?.scrollIntoView( { behavior: "smooth" })

  },[messages])
  const newLeft =
    coordinate.left >= 0
      ? coordinate.left < bodyWidth - width - 8
        ? coordinate.left
        : bodyWidth - width - 8
      : 0;
  const newTop =
    coordinate.top >= 0
      ? coordinate.top < bodyHeight - height
        ? coordinate.top
        : bodyHeight - height
      : 0;

  return (
    <div
      className="chatWindowBox"
      ref={divRef}
      onMouseDown={handleDown}
      style={{ position: "absolute", top: newTop, left: newLeft, zIndex: 9999 }}
    >
      <div className="chatWindow">
        <div className="cross">
          <strong className="cursor"></strong>
          <CloseIcon onClick={handleClose} className="crossIcon" />
        </div>
        <div className="startMsg">Welcome to the Chat!!!</div>
        < div className="msgListCont">
        <MessageList
          className="message-list"
          dataSource={messages}
          lockable = {false}
          toBottomHeight={'100%'}
        />
        <div ref = {msgEndRef} />
       </div>
        <div className="inputBox2">
          <input type="text" className="inputField" onChange={handleMsg} value={msg} />
          <button className="sendBtn" onClick={handleSend}>
            <SendIcon sx={{color:"black"}} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
