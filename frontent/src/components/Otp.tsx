import  { useEffect, useState } from "react";
import {  useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import useRequest from "@/hooks/useRequest";
import { userRoute } from "@/service/endPoints";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { setUser } from "@/redux/slice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const FormSchema = z.object({
  otp: z
    .string()
    .min(1, {
      message: "This field is required.",
    })
});

const Otp = ({email,name,password}:{email:string,name:string,password:string}) => {
     const [second,setSecond] = useState(59);
     const [minutes,setMinute] = useState(1);
     const [send,setSend] = useState(false);
     const {doRequest,errors} = useRequest();
     const navigate = useNavigate();
     const dispatch = useDispatch();
     
     useEffect(()=>{
        setSend(false)
        errors?.map((err)=>toast.error(err.message))
     },[errors])
     
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    }
  });

  useEffect(()=>{
    const intervel = setInterval(() => {
       if(second > 0){
        setSecond(second-1);
       }
       if(second === 0){
        if(minutes === 0){
           clearInterval(intervel)
        }else{
          setSecond(59)
          setMinute(minutes-1)
        }
       }
    }, 1000);
    return () => {
      clearInterval(intervel);
    }
  },[second])
  const handleOtp = async(data: z.infer<typeof FormSchema>) =>{
    
    const {otp} = data;
    doRequest({
      url:userRoute.otp,
      method:'post',
      body:{email,password,name,otp},
      onSuccess:(res)=>{
        dispatch(setUser(res))
        navigate('/')
        toast.success("Register successfully...")
    }
    });
  }
  const resentOTP = async() => {
    setSend(true)
    doRequest({
      url:userRoute.resentOtp,
      method:'post',
      body:{email},
      onSuccess:()=>{
        setSecond(59)
        setMinute(1)
        setSend(false)
        return  toast.success("Resnt OTP Sent to Your Mail")
      }
    });
  }

  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader className="flex items-center">
          <CardTitle>Enter your Otp</CardTitle>
          <CardDescription>
            We sent you an 6 digit otp to your mail.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOtp)}>
             <CardContent>
            <div className="flex flex-col space-y-1.5">
            <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>otp</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="otp" {...field}  />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <div className="flex items-center justify-between">
                <p>
                  Time Remaining:{" "}
                  <span style={{ color: "black", fontWeight: 600 }}>
                    {minutes! < 10 ? `0${minutes}` : minutes}:
                    {second! < 10 ? `0${second}` : second}
                  </span>
                </p>
                <button
                  disabled={second > 0 || minutes > 0 || send}
                  style={{
                    color: second > 0 || minutes > 0 || send ? "#DFE3E8" : "#FF5630",
                  }}
                  type="button"
                  onClick={resentOTP}
                  className="submit-btn"
                >
                  Resend Otp
                </button>
              </div>
              <CardFooter>
                 <Button className="w-full rounded-2 bg-pink-400 hover:bg-white hover:text-pink-500">Verify</Button>
              </CardFooter>
            </CardContent> 
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Otp;
