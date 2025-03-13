import { client } from "@/service/client";
import {  useState } from "react";

export default () => {
    const [errors,setError] = useState<null|{message:string}[]>(null)
    const doRequest =  async({url,method,body,onSuccess}:{
      url: string; 
      method:  "get" | "post" | "put" | "delete" | "patch"; 
      body: object; 
      onSuccess: (data:any) => void
   }) => {
      try {
       setError(null)
         const response = await client[method](url,body)
         if(onSuccess){
           onSuccess(response.data)
         }
         return response.data;
      } catch (err:any) {
        setError(err.response.data.errors)
      }
   }
    return {doRequest,errors};
}