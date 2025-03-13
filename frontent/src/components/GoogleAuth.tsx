import  { useEffect } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useRequest from "@/hooks/useRequest";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";
import { userRoute } from "@/service/endPoints";
import { setUser } from "@/redux/slice";


const GoogleAuth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const {doRequest,errors} = useRequest();

    useEffect(()=>{
        errors?.map((err)=>toast.error(err.message));
    },[errors])
     const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
          try {
            const userInfo = await axios.get(
              import.meta.env.VITE_GOOGLE_LOGIN_URL,
              {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              }
            );
            doRequest({
              url:userRoute.googleAuth,
              method:'post',
              body:{email:userInfo.data.email,name:userInfo.data.name,password:userInfo.data.sub},
              onSuccess:(res)=>{
                console.log(res);
                toast.success("Welcome to Recipe World...")
                dispatch(setUser(res))
                navigate("/")
              }
            })
          
          } catch (error) {
            console.error("Error fetching user info:", error);
          }
        },
        onError:(err)=>console.error("error",err)
      });

  return (
    <>
      <Button
        type="button"
        onClick={() => googleLogin()}
        variant="outline"
        className="w-full border-1 border-amber-950 mb-3 rounded text-black "
      >
        <i className="bi bi-google"> Google</i>
      </Button>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </>
  );
};

export default GoogleAuth;
