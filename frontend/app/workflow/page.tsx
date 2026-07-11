"use client";


import {
useEffect
} from "react";


import {
useRouter
} from "next/navigation";


import {
useAuth
} from "@/hooks/useAuth";


import UploadResume
from "@/components/dashboard/UploadResume";



export default function WorkflowPage(){


const router = useRouter();


const {
user,
loading
}=useAuth();



useEffect(()=>{


if(!loading && !user){

router.replace("/login");

}


},[
loading,
user,
router
]);




if(loading){

return(

<div className="
min-h-screen
flex
items-center
justify-center
bg-[#05060a]
text-white
">

Loading...

</div>

)

}



if(!user){

return null;

}



return(

<div className="
min-h-screen
bg-[#05060a]
flex
items-center
justify-center
px-6
">


<UploadResume />


</div>


)


}
