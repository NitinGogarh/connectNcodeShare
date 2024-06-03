import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Navbar from "../components/Navbar";

const Home: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState(location?.state?location.state:"");
  const [userName, setUserName] = useState("");
  
  const createNewRoom = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setRoomId(uuidv4());
    toast.success("Created a new room");
  };
  const joinRoom = () => {
    
    if (!roomId || !userName) {
      toast.error("Room Id and UserName is required");
      return;
    }
    //redirect
    navigate(`/${roomId}`, {
      state: {
        userName,
      },
    });
   
  };
  const handleEnterInput = (e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.code=='Enter')
      {
        joinRoom()
      }
  }
  return (
    <>
    < Navbar />
    <div className="homePageWrapper">
      <div>
        <Toaster position="top-right" toastOptions={{
            success: {
              iconTheme: {
                primary: '#4aee88',
                secondary: 'black',
              },
            },
        }}>

        </Toaster>
      </div>
      <div className="formWrapper">
        <h2 className="homePageLogo">CodeShare Connect</h2>
        <h4 className="mainLabel">Paste Invitation Room ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            placeholder="ROOM ID"
            className="inputBox"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleEnterInput}
          />
          <input
            type="text"
            placeholder="USERNAME"
            className="inputBox"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyUp={handleEnterInput}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have an invite then create{" "}
            <a onClick={createNewRoom} href="" className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Made with ❤️ by <a href="https://github.com/NitinGogarh">Nitin Gogarh</a>
        </h4>
      </footer>
    </div>
    </>
  );
};

export default Home;
