import axios from "axios";
import { newMap } from "./constants";
const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});
export const runCode = async (language:string, value:string,input:string) => {
 
    const response = await API({
      method: "post",
      url: "/execute",
      data: {
        language:language.toLowerCase(),
        version: newMap.get(language),
        files: [
          {
            content: value,
          },
        ],
        stdin: input,
        args: ["1", "2", "3"],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1
      },
      headers:{
        "Content-Type" : "application/json"
      }
    });
  const {data:{run}} = response
  console.log(response)
 return run
};
