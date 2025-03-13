
import Cards from "@/components/Cards";
import Header from "@/components/Header";
import SmallCard from "@/components/SmallCard";
import { Button } from "@/components/ui/button";
import {
  DrawerTrigger,
  DrawerContent,
  Drawer,
  DrawerTitle,
  DrawerDescription,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import useRequest from "@/hooks/useRequest";
import { IRecipe, IUser, IWishlist } from "@/lib/types";
import { wishlistRoute } from "@/service/endPoints";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Wishlist = () => {
  const [search, setSearch] = useState("");
  const [debouns, setDebouns] = useState("");
  const [recipe, setRecipe] = useState<IRecipe[]>([]);
  const [wishlist, setWishlist] = useState<IWishlist>();
  const id = useSelector((state: IUser) => state._id);
  const { doRequest,errors } = useRequest();
  useEffect(() => {
    doRequest({
      url: `${wishlistRoute.wishlist}/${id}`,
      method: "get",
      body: {},
      onSuccess: (data) => {
        setWishlist(data.wishlist)
      },
    })
  }, []);

  useEffect(() => {
    const intervel = setTimeout(() => {
      setDebouns(search);
    }, 600);
    return () => {
      clearTimeout(intervel);
    };
  }, [search]);
  useEffect(() => {
   
    const fetching = async () => {
      if (debouns.length == 0) {
       const {data} = await axios.get(`${import.meta.env.VITE_SPOONACULAR_API}/complexSearch?number=100&apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}`)
       setRecipe(data.results)
    } else {
        const {data} = await axios.get(`${import.meta.env.VITE_SPOONACULAR_API}/complexSearch?query=${debouns}&number=100&apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}`)
        setRecipe(data.results)
    }
    };
    fetching();
  }, [debouns]);

  useEffect(()=>{
    errors?.map((err)=>toast.error(err.message))
  },[errors])
  return (
    <div className={`bg-pink-50 ${ !wishlist?.recipes.length&&"h-screen" } `}>
      <Header />
      <div className="container">

        {/* head part start  */}

       <div className="">
          <div className="font-bold text-center underline text-2xl">
            My Favorites
          </div>
            <Drawer>
                <DrawerTrigger asChild >
                <Button className="bg-violet-500 rounded-4 hover:bg-violet-500">Search</Button>
                </DrawerTrigger>
                <DrawerContent className="h-screen">
                <DrawerHeader>
                    <DrawerTitle></DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className="flex w-full gap-1 justify-center items-center">
                    <Input
                    type="text"
                    className="bg-white text-black md:w-50 w-75 rounded-full"
                    value={search}
                    onChange={(e) => {
                        if (/^[A-Za-z\s]*$/.test(e.target.value)) {
                        setSearch(e.target.value);
                        }
                    }}
                    placeholder="Search recipe here"
                    />
                    {search && (
                    <i
                        className="bi bi-x-circle text-secondary cursor-pointer"
                        onClick={() => setSearch("")}
                    ></i>
                    )}
                </div>
                <ScrollArea className="h-full w-full mt-4 ">
                    <SmallCard arr={recipe} />
                </ScrollArea>
                </DrawerContent>
            </Drawer>
         
       </div>

        {/* head part end  */}

        {/* body part end  */}

        <Cards arr={[]} />

        {/* body part end  */}

      </div>
    </div>
  );
};

export default Wishlist;
