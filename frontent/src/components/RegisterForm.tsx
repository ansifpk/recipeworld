import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {   useEffect,  useState } from "react";
import { toast } from "sonner";
import useRequest from "@/hooks/useRequest";
import { userRoute } from "@/service/endPoints";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import Otp from "./Otp";
import GoogleAuth from "./GoogleAuth";
import { useNavigate } from "react-router-dom";

const FormSchema = z.object({
  email: z.string().min(1, {
    message: "This field is required.",
  }).email({ message: "Invalid email format." }),
  password: z.string().min(8, {
    message: "Password shuld be in between 8 - 20.",
  }).max(20,{
    message: "Password shuld be in between 8 - 20.",
  }),
  confirmPassword: z.string().min(1, {
    message: "This field is required.",
  }),
  name: z.string().min(1, {
    message: "This field is required.",
  })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirmPassword do not match",
    path: ["confirmPassword"], 
  });

const RegisterForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  })
  
 
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [page, setPage] = useState("signIn");
  const [loading,setLoading] = useState(false)


  
  const navigate = useNavigate();
  const {doRequest,errors} = useRequest();
  
 //TODO  signUp

  const handleSubmit = async(data: z.infer<typeof FormSchema>) => {
       const {password,email,name} = data;
       setLoading(true)
       setEmail(email)
       setName(name)
       setPassword(password)
      await  doRequest({
          url:userRoute.signUp,
          method:'post',
          body:{email,password,name},
          onSuccess:()=>{
            toast.success("OTP send to your mail.")
            setPage("otp")
            setLoading(false)
          }
      });
  };

  //! errors start
  useEffect(()=>{
    setLoading(false)
    errors?.length!>0&&errors!.map((err)=>toast.error(err.message))
  },[errors])
  //! errors end

 

 
  if(page == "otp"){
    return (
     <Otp email={email} name={name} password={password} />
    )
  }
  return (
   <div >
     <Card className="w-[350px]">
      <CardHeader className="flex items-center">
        <CardTitle>Welcom Back</CardTitle>
        <CardDescription>Sign In with your google.</CardDescription>
      </CardHeader>
      <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} >
                <CardContent>
                <GoogleAuth />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input placeholder="Confirm password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col justify-between">
                      <Button
                        type="submit"
                        variant="outline"
                        disabled={loading}
                        className="w-full mb-3 border-1 border-amber-950 rounded text-black "
                      >
                      {loading?'Sending otp...':'Sign Up'}
                      </Button>
                      <div>
                        ALready have n account? <span onClick={()=>{
                           navigate("/signIn")
                        }} className="underline cursor-pointer">Sign In</span>
                      </div>
                    </CardFooter>
            </form>
          </Form>
      {/* <form onSubmit={handleSubmit}>
        <CardContent>
          <Button
            type="button"
            onClick={()=>googleLogin()}
            variant="outline"
            className="w-full border-1 border-amber-950 mb-3 rounded text-black "
          >
            
            Google Login
          </Button>
          <div  className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
          <div className="grid w-full items-center gap-4 ">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="Email">Email</Label>
              <Input
                value={email}
                onChange={(e) =>{
                  if(/^[A-Za-z0-9.%+-]+@gmail\.com$/.test(email)){
                     setError((pre)=>({
                      ...pre,
                      email:false
                    }))
                  }
                  setEmail(e.target.value)
                }}
                id="Email"
                placeholder="Email"
              />
             {error.email&&<span className="text-danger text-sm">This field is required</span>}
            </div>
            {page=="signUp"&& <div className="flex flex-col space-y-1.5">
              <Label htmlFor="Name">Name</Label>
              <Input
                value={name}
                onChange={(e) => {
                  if(name.length>0){
                    setError((prev)=>({
                      ...prev,
                      name:false
                    }))
                  }
                  setName(e.target.value)
                }}
                id="Name"
                placeholder="Name"
              />
              {error.name&&<span className="text-danger text-sm">This field is required</span>}
            </div>}
            <div className="flex flex-col space-y-1.5 ">
                <div className="relative">
                <Label htmlFor="Password">Password</Label>
              <Input
                value={password}
                onChange={(e) =>{
                  if(password.length>=8&&password.length<=20){
                    setError((prev)=>({
                      ...prev,
                      password:false
                    }))
                  }
                   setPassword(e.target.value)
                  }}
                id="Password"
                placeholder="Password"
                type={showPassword ?"string":"password"}
              />
               <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                </div>
           
              {error.password&&<span className="text-danger text-sm">This field is required</span>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col justify-between">
        
          <Button
            type="submit"
            variant="outline"
            className="w-full mb-3 border-1 border-amber-950 rounded text-black "
          >
           {page=="signIn"?'Sign In':'Sign Up'}
          </Button>
          <div>
            Don't have n account? <span onClick={()=>{
                if(page=="signIn"){
                    setPage("signUp")
                }else{
                    setPage("signIn")
                }
            }} className="underline cursor-pointer">{page=="signIn"?'Sign Up':'Sign In'}</span>
          </div>
        </CardFooter>
      </form> */}
    </Card>
   </div>
  );
};

export default RegisterForm;
