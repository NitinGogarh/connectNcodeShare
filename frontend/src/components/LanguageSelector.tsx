import React from "react";
import { LANG } from "./constants";
interface Iprops {
  lang: string;
  onSelect: (lang: string) => void;
}
const LanguageSelector: React.FC<Iprops> = ({ lang, onSelect }) => {
  return (
    <div className="editorBack">
      <select name="language" id="language" className="selector" value={lang} onChange={(e)=>{onSelect(e.currentTarget.value)}}>
        {LANG.map((language, index) => {
          return (
            <option
              value={language}
              key={index}
              className="options"
            >
              {language}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default LanguageSelector;
