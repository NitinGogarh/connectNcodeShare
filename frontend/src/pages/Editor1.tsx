import Editor from "@monaco-editor/react";
import React, { useEffect, useRef, useState } from "react";
import LanguageSelector from "../components/LanguageSelector";
import { Socket } from "socket.io-client";
import { codeSnippets } from "../components/constants";
import Output from "../components/Output";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { ACTIONS } from "../components/Action";

type Iprops = {
  roomId: string | undefined;
  socketRef: React.MutableRefObject<Socket | undefined>;
  onCodeChange: (code: string) => void;
  onLangChange: (code: string) => void;
  onOutputChange: (code: { value: string; error: string }) => void;
  onInputChange: (code: string) => void;
 
};
enum enumSymbol {
  RightArrow = "rightArrow",
  LeftArrow = "leftArrow",
}
const Editor1: React.FC<Iprops> = ({
  roomId,
  socketRef,
  onCodeChange,
  onLangChange,
  onOutputChange,
  onInputChange,
}) => {
  const [output, setOutput] = useState("");
  const [lang, setLang] = useState("Javascript");
  const [value, setValue] = useState(`${codeSnippets[lang]}`);
  const draggerRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const editorMainRef = useRef<HTMLDivElement>(null);
  const [symbol, setSymbol] = useState<enumSymbol>(enumSymbol.RightArrow);
  
   const [width,setBodyWidth] = useState<number>(0)
 
  const onSelect = async (language: string) => {
    onLangChange(language);
    setLang(language);
    const findLang = codeSnippets[language];
    setValue(findLang);
    setOutput("");
    socketRef.current?.emit(ACTIONS.LANG_CHANGE, {
      lang: language,
      roomId,
    });
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: findLang,
    });
    if (findLang) onCodeChange(findLang);
  };

  function handleEditorChange(value: string | undefined) {
    if (value) setValue(value);
    socketRef.current?.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code: value,
    });
    if (value) onCodeChange(value);
  }

  useEffect(() => {
    socketRef.current?.on(ACTIONS.CODE_CHANGE, ({ code }) => {
      if (code) {
        setValue(code);
        onCodeChange(code);
      }
    });
    socketRef.current?.on(ACTIONS.LANG_CHANGE, ({ lang }) => {
      if (lang) {
        setLang(lang);
        onLangChange(lang);
      }
    });

    return () => {
      socketRef.current?.off(ACTIONS.CODE_CHANGE);
      socketRef.current?.off(ACTIONS.LANG_CHANGE);
    };
  }, [socketRef.current]);


 useEffect(()=>{
  if(outputRef.current)
    {
      if(outputRef.current.offsetWidth==0)setSymbol(enumSymbol.LeftArrow)
    }
  const handle = ()=>{
    setBodyWidth(document.body.offsetWidth);
    console.log(width)
  }
  handle()
     window.addEventListener('resize',handle)
     return ()=>{
      window.removeEventListener('resize',handle)
     }
 },[width])
  const handleOpenOutput = () => {
    if (!codeRef.current||!editorMainRef.current||!outputRef.current) return;
  

    codeRef.current.style.transition = "0.5s ease-in-out";
    outputRef.current.style.transition = "0.5s ease-in-out";
    
   let init = 0;
    if(width<900)init = 50;
    if(width<800)init = 60;
    if(width<700)init = 100;
    if(width>=900)init = 40;
  
    if (symbol === enumSymbol.RightArrow) { 
      codeRef.current.style.width = `99%`
      outputRef.current.style.width = "0px"
      setSymbol(enumSymbol.LeftArrow)
    } else { 
      codeRef.current.style.width = 100-init+'%'
      outputRef.current.style.width = init+'%'
      setSymbol(enumSymbol.RightArrow);
    }
  };
  
  return (
    <div className="editorMainWrap" ref = {editorMainRef}>
      <div className="writeCode" ref={codeRef} >
        <LanguageSelector lang={lang} onSelect={onSelect} />
        <div className="codeEditor">
          <Editor
            language={lang?.toLowerCase()}
            theme="vs-dark"
            value={value}
            onChange={handleEditorChange}
          />
         
        </div>
        
      </div>
      <div className="dragger" ref={draggerRef} onClick={handleOpenOutput}>
            {symbol === enumSymbol.LeftArrow ? (
              <KeyboardArrowLeftIcon sx={{fontSize:'2rem',paddingTop:'33px'}} />
            ) : (
              <KeyboardArrowRightIcon sx={{fontSize:'2rem',paddingTop:'33px'}} />
            )}
          </div>
      <Output
        language={lang}
        value={value}
        output={output}
        setOutput={setOutput}
        socketRef={socketRef}
        onOutputChange={onOutputChange}
        onInputChange={onInputChange}
        outputRef={outputRef}
      />
    </div>
  );
};

export default Editor1;
