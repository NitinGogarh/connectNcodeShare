import { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor1 from "./Editor1";
import { initSocket } from "../socket";
import { Socket } from "socket.io-client";
import { ACTIONS } from "../components/Action";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ChatBox from "../components/ChatBox";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const EditorPage = () => {
  interface Iclients {
    socketId: number;
    userName: string;
  }
  type Iparams = {
    roomId: string;
  };
  const socketRef = useRef<Socket>();
  const location = useLocation();
  const navigate = useNavigate();
  const codeRef = useRef("");
  const langRef = useRef("");
  const outputRef = useRef({})
  const inputRef = useRef("")
  const params = useParams<Iparams>();
  const [isOpen,setIsOpen] = useState<boolean>(true)
  const asideRef = useRef<HTMLDivElement>(null)
  const [bodyWidth,setBodyWidth] = useState(0)
  useEffect(() => {
    if (!location.state) return navigate("/",{
      state:params.roomId
    });

    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: params.roomId,
        userName: location.state?.userName,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ userName, clients, socketId }) => {
          if (userName != location.state?.userName) {
            toast.success(`${userName} joined the room`);
          }
          setClients(clients);

          socketRef.current?.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId: socketId,
            lang: langRef.current,
            input:inputRef.current,
            output:outputRef.current
          });
          if (userName == location.state?.userName) {
            toast.success(`Welcome ${userName}`);
          }
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, userName }) => {
        toast.error(`${userName} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  const handleErrors = (err: object) => {
    console.log("socket error", err);
    toast.error("Socket connection failed, try again later");
    navigate("/");
    return;
  };

  const [clients, setClients] = useState<Iclients[]>([]);
  const handleLeave = () => {
    navigate("/");
  };
  const copyRoomId = async () => {
    try {
      if (params.roomId) await navigator.clipboard.writeText(params?.roomId);
      toast.success("RoomId Copied to your clipboard");
    } catch (error) {
      toast.error("Error Occured:Couldn't copied");
    }
  };
  const handleClose = ()=>{
     setIsOpen(false)
     if(asideRef.current)
      {
     asideRef.current.style.width = "0";
     asideRef.current.style.padding = "0";
     asideRef.current.style.transition = "0.5s ease-in-out"
      }
  }
  const handleOpen = ()=>{
     setIsOpen(true)
      if(asideRef.current)
      {let width = 15;
        if(bodyWidth<=1100)width = 35
        if(bodyWidth<700)width  = 70
     asideRef.current.style.width = `${width}%`;
     asideRef.current.style.padding = "11px";
     asideRef.current.style.transition = "0.5s ease-in-out"
      }
  }
  useEffect(()=>{
   const handle = ()=>{
    setBodyWidth(document.body.scrollWidth)
    const width = document.body.scrollWidth
       if(asideRef.current)
        {
          if(asideRef.current.offsetWidth==0)
            setIsOpen(false)
          if(width>1100&&asideRef.current?.offsetWidth!=0)
            asideRef.current.style.width = "15%";
          else if(width>700&&asideRef.current?.offsetWidth!=0)
            {
              asideRef.current.style.width = "35%";
            }
            else if(width<=700&&asideRef.current?.offsetWidth!=0)
              {
                asideRef.current.style.width = "0%";
                asideRef.current.style.padding = "0%";
              }
        }
        
        
   }
   handle()
   window.addEventListener('resize',handle)
   return ()=>{
    window.removeEventListener('resize',handle)
   }
  },[])
  const handleCopyUrl = async ()=>{
    try {
      if (params.roomId) await navigator.clipboard.writeText(`https://codeshare-connect.vercel.app/${params?.roomId}`);
      toast.success("Url Copied to your clipboard");
    } catch (error) {
      toast.error("Error Occured:Couldn't copied");
    }
  }
  return (
    <div className="mainWrap">
      <ChatBox  socketRef = {socketRef} RoomId = {params.roomId} userName = {location.state?.userName} />
      <div className="aside" ref={asideRef}>
        
        <div className="asideInner">
          <div className="logo">
            <h2 className="logoImage">CodeShare </h2>
          </div>
          <h4>Connected</h4>
          <div className="clientList">
            {clients.map((client, index) => {
              return <Client key={index} userName={client.userName} />;
            })}
          </div>
        </div>
        <button className="btn copyBtn" onClick={handleCopyUrl}>
          Copy Url
        </button>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy Room ID
        </button>
        <button className="btn leaveBtn" onClick={handleLeave}>
          Leave
        </button>
      </div>
      <div className="arrowBtn">{
         isOpen ?  < KeyboardArrowLeftIcon onClick = {handleClose} style={
          {
            fontSize: "2rem",
          }
         }/> : <KeyboardArrowRightIcon onClick = {handleOpen}  style={
          {
            fontSize: "2rem",
          }
         } />

        }</div>
          <div className="editorWrap">
        <Editor1
          socketRef={socketRef}
          roomId={params.roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
          onLangChange={(lang) => {
            langRef.current = lang;
          }}
          onInputChange = {(input)=>{
            inputRef.current = input;
          }}
          onOutputChange = {(output)=>{
            outputRef.current = output
          }}
         
        />
    
    </div>
    </div>
  );
};

export default EditorPage;
