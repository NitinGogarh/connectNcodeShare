import React, { useState, useEffect, useRef } from "react";
import ModeCommentIcon from "@mui/icons-material/ModeComment"; // The default
import ChatWindow from "./ChatWindow";
import { Socket } from "socket.io-client";
import { MessageType } from "react-chat-elements";
type Tprops = {
    socketRef: React.MutableRefObject<Socket | undefined>;
    RoomId:string|undefined,
    userName:string
}

const ChatBox:React.FC<Tprops> = ({socketRef,RoomId,userName}) => {
  const [bodyWidth, setBodyWidth] = useState<number>(0);
  const [bodyHeight, setBodyHeight] = useState<number>(0);
  const [display, setDisplay] = useState(false);
  const [coordinate, setCoordinate] = useState({ left: 0, top: 0});
  const position = useRef(null);
  const [messages,setMessages] = useState<MessageType[]>([])
  useEffect(() => {
    // Function to update the body height
    const updateBodyHeight = () => {
        const newBodyWidth = document.body.scrollWidth;
        const newBodyHeight = document.body.scrollHeight;
        setBodyWidth(newBodyWidth);
        setBodyHeight(newBodyHeight);
        setCoordinate({ left: newBodyWidth - 80, top: newBodyHeight - 80 });
    };

    // Initial call to set the body height
    updateBodyHeight();

    // Add event listener for window resize
    window.addEventListener("resize", updateBodyHeight);
   
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateBodyHeight);
    };
  }, []);

  const handleClick = () => {
    setDisplay(true);
  };

  const handleDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const post = event.currentTarget.getBoundingClientRect();
    const { left, top } = post;
    console.log(left);
    const leftX = event.clientX - left;
    const rightY = event.clientY - top;
    const handleMove = (moveEvent:MouseEvent) => {
      const newLeft = moveEvent.clientX - leftX;
      const newTop = moveEvent.clientY - rightY;
      setCoordinate({ left: newLeft, top: newTop });
    };
    const handleUp = () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
  };
  const newLeft = coordinate.left >= 0 ?coordinate.left < bodyWidth-40 ? coordinate.left :bodyWidth-40 :0;
  const newTop = coordinate.top >= 0 ?coordinate.top < bodyHeight-44 ? coordinate.top :bodyHeight-44 :0;
  return (
    
    <>
  
        {display ? (
          <ChatWindow
            bodyWidth={bodyWidth}
            setDisplay={setDisplay}
            coordinate={coordinate}
            handleDown={handleDown}
            bodyHeight = {bodyHeight}
            socketRef = {socketRef} RoomId = {RoomId} userName = {userName}
            messages = {messages}
            setMessages = {setMessages}
          />
        ) : (
          <div
            className="iconBtn"
            onMouseDown={handleDown}
            style={{
              backgroundColor: "inherit",
              width: "fit-content",
              position: "absolute",
              left:newLeft,
              top:newTop,
              zIndex:999999
            }}
            onClick={handleClick}
            ref={position}
          >
            <ModeCommentIcon
              sx={{ color: "white", fontSize: "40px", cursor: "pointer" }}
            />
          </div>
        )}
    
    </>
  );
};

export default ChatBox;
