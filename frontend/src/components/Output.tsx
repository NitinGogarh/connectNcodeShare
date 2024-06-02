import React, { useEffect, useState } from "react";
import { runCode } from "./Api";
import toast, { Toaster } from "react-hot-toast";
import { Socket } from "socket.io-client";
import { ACTIONS } from "./Action";
import { useParams } from "react-router-dom";
interface Iprops {
  language: string;
  value: string;
  output: string;
  setOutput: (output: string) => void;
  socketRef: React.MutableRefObject<Socket | undefined>;
  onOutputChange:(code:{value:string,error:string})=>void;
  onInputChange:(code:string)=>void;
  outputRef:React.RefObject<HTMLDivElement>
}
type Iparams = {
  roomId: string;
};
const Output: React.FC<Iprops> = ({ language, value, output, setOutput,socketRef,onInputChange ,onOutputChange,outputRef}) => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [isError,setIsError] = useState(false)
  const params = useParams<Iparams>();
  const executeCode = async () => {
    try {
        setLoading(true);
        socketRef.current?.emit(ACTIONS.SET_LOADING,{roomId:params.roomId,value:true})
        const result = await runCode(language, value, input);
        setOutput(result.output);
        socketRef.current?.emit(ACTIONS.OUTPUT_CHANGE,{roomId:params.roomId,value:result.output,error:result.stderr})
        onOutputChange({value:result.output,error:result.stderr})
        result.stderr ? setIsError(true) : setIsError(false);
      } catch (error) {
        const typedError = error as { message: string };
        console.log("error:", error);
        toast.error(typedError?.message || "Something went wrong in the backend");
      } finally {
        setLoading(false);
        socketRef.current?.emit(ACTIONS.SET_LOADING,{roomId:params.roomId,value:false})
      }
  };
  const handleInputChange = (values:string) => {
   
    setInput(values);
    onInputChange(values) 
    socketRef.current?.emit(ACTIONS.INPUT_CHANGE,{value :values,roomId:params.roomId})
  };
  useEffect(()=>{
   
    socketRef.current?.on(ACTIONS.INPUT_CHANGE,({value})=>{
      if(value)
        {
      setInput(value)
      onInputChange(value)
        }
      
    })

    socketRef.current?.on(ACTIONS.OUTPUT_CHANGE,({value,error})=>{
      if(value)
        {
      setOutput(value)
      onOutputChange({
        value,error
      })
     error ? setIsError(true) : setIsError(false);
        }
      
    })

    socketRef.current?.on(ACTIONS.SET_LOADING,({value})=>{
      setLoading(value)
    })
    return ()=>{
      socketRef.current?.off(ACTIONS.INPUT_CHANGE)
      socketRef.current?.off(ACTIONS.OUTPUT_CHANGE)
      
    }
  },[socketRef.current])
  return (
    <div className="runCode" ref = {outputRef}>
        <Toaster position="bottom-center"/>
      <button className="btn runBtn" onClick={executeCode}>
        {loading ? "Executing..." : "Run Code"}
      </button>
      <div className="inputOutput" >
        <div className="inputWrap">
          <h3 className="inputH3">Input</h3>
          <textarea
            className="inputBox"
            onChange={(e)=>handleInputChange(e.target.value)}
            value={input}
            spellCheck={false}
          ></textarea>
        </div>
        <div className="outputWrap">
          <h3 className="outputH3">Output</h3>
          <div className="outputBox" style={{color:isError?"red":"",border:isError?"1px solid red":""}}>
            {loading
              ? "executing....."
              : output
              ? output
              : "Click 'Run Code' to see the Output here"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Output;
