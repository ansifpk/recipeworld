import useRequest from "@/hooks/useRequest";
import { ICuisine, IUser, IWishlist } from "@/lib/types";
import { wishlistRoute } from "@/service/endPoints";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ChildProps {
  arr: ICuisine[] ;
}

const Cards: React.FC<ChildProps> = ({ arr }) => {
  const navigate = useNavigate();
  const location = useLocation();
  

  const id = useSelector((state: IUser) => state._id);
  const [favorites, setFavorites] = useState<IWishlist | null>(null);
  const [wishlist, setWishlist] = useState<ICuisine[]>();
   useEffect(()=>{
    if(location.pathname == "/wishlist" && wishlist ! == null){
      let ids =favorites?.recipes.join(",")
       const fetching = async () =>{
        const {data} = await axios.get(`${import.meta.env.VITE_SPOONACULAR_API}/informationBulk?ids=${ids}&apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}`);
        setWishlist(data);
       }
       fetching()
    }
   },[favorites])
  const { doRequest,errors } = useRequest();

  useEffect(() => {
  if(id){
    doRequest({
      url: `${wishlistRoute.wishlist}/${id}`,
      method: "get",
      body: {},
      onSuccess: (data) => {
        setFavorites(data)
      },
    });
  }

  }, [id]);
  useEffect(()=>{
    errors?.map((err)=>toast.error(err.message))
  },[errors])
  const handleWishlist = async (recipeId: number) => {
    if (favorites == null) {
      if(id){
        await doRequest({
          url: `${wishlistRoute.wishlist}/${id}`,
          method: "post",
          body: {recipeId},
          onSuccess: (response) => {
            setFavorites(response);
          },
        });
      }else{
        navigate('/signIn')
      }
      
      
    } else {
      
     await doRequest({
        url: `${wishlistRoute.wishlist}/${id}`,
        method: "patch",
        body: {recipeId},
        onSuccess: (response) => {
          setFavorites(response);
        },
      });
     
    }
  };


  if (arr.length == 0 && favorites == null) {
    return (
      <div className="flex   justify-center h-full w-full">
        <div className="mt-52 ">
        <span className="text-black font-bold text-1xl">
          No Favorite items&nbsp;&nbsp;&nbsp;
        </span> 
        <span onClick={()=>navigate('/allRecipes')} className="text-black cursor-pointer underline font-bold text-1xl">
          Go to Recipes
        </span>
        </div>
        
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 w-75  mt-4 mx-auto">
      {location.pathname == "/wishlist" ? (
        <>
         
          {wishlist?.map((val,index)=>(
              <div key={index} className="w-[250px]">
              <div
                onClick={() => navigate(`/detailes?recipeId=${val.id}`)}
                className="w-[250px] h-[250px]"
              >
                <img
                  src={val.image}
                  className="w-full p-1 h-full object-cover"
                  alt={val.image}
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="flex justify-between w-full">
                  <i
                    onClick={() => handleWishlist(val.id)}
                    className={`${
                      favorites?.recipes.includes(val.id)
                        ? "bi-heart-fill"
                        : "bi-heart"
                    } text-danger cursor-pointer`}
                  ></i>
                </div>
  
                <div
                  className="text-center "
                  onClick={() => navigate(`/detailes?recipeId=${val.id}`)}
                >
                  <div className="font-bold">{val.title}</div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        //  for recipe page start
        arr?.map((val: ICuisine, index) => (
          <div key={index} className="md:w-[250px] sm:w-[150px]">
            <div
              onClick={() => navigate(`/detailes?recipeId=${val.id}`)}
              className="md:w-[250px] md:h-[250px] sm:w-[150px] "
            >
              <img
                src={val.image}
                className="w-full p-1 h-full object-cover"
                alt={val.image}
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="flex justify-between w-full">
                {val.aggregateLikes && (
                  <i className="bi bi-hand-thumbs-up-fill text-primary">
                    {val.aggregateLikes}
                  </i>
                )}
                <i
                  onClick={() => handleWishlist(val.id)}
                  className={`${
                    favorites?.recipes.includes(val.id)
                      ? "bi-heart-fill"
                      : "bi-heart"
                  } text-danger cursor-pointer`}
                ></i>
              </div>

              <div
                className="text-center "
                onClick={() => navigate(`/detailes?recipeId=${val.id}`)}
              >
                <div className="font-bold text-xs">{val.title}</div>
              </div>
            </div>
          </div>
        ))
        //  for recipe page end
      )}
    </div>
  );
};

export default Cards;
