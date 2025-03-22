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
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slice";
import useRequest from "@/hooks/useRequest";
import { userRoute } from "@/service/endPoints";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import GoogleAuth from "./GoogleAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const FormSchema = z.object({
  email: z.string().min(1, {
    message: "This field is required.",
  }),
  password: z.string().min(1, {
    message: "This field is required.",
  }),
});

const LoginForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doRequest, errors } = useRequest();

  //TODO login and signUp

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { password, email } = data;
    doRequest({
      url: userRoute.signIn,
      method: "post",
      body: { email, password },
      onSuccess: (data) => {
        console.log(data,"//");
        
        // dispatch(setUser(data));
        // navigate("/");
      },
    });
  };

  //! errors start
  useEffect(() => {
    errors?.length! > 0 && errors!.map((err) => toast.error(err.message));
  }, [errors]);
  //! errors end

  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader className="flex items-center">
          <CardTitle>Welcom Back</CardTitle>
          <CardDescription>Sign In with your google.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <CardContent>
              <GoogleAuth />
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
            </CardContent>
            <CardFooter className="flex flex-col justify-between">
              <Button
                type="submit"
                variant="outline"
                className="w-full mb-3 border-1 border-amber-950 rounded text-black "
              >
                Sign In
              </Button>
              <div>
                Don't have n account?{" "}
                <span
                  onClick={() => {
                    navigate("/signUp");
                  }}
                  className="underline cursor-pointer"
                >
                  Sign Up
                </span>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
