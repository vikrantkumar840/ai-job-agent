"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  uploadResume,
  runOrchestrator,
} from "@/lib/api";

import { useAuth } from "@/hooks/useAuth";


export default function UploadResume() {

  const router = useRouter();

  const { user } = useAuth();


  const inputRef = useRef<HTMLInputElement>(null);


  const [file,setFile] =
    useState<File | null>(null);

  const [location,setLocation] =
    useState("");

  const [department,setDepartment] =
    useState("");

  const [experience,setExperience] =
    useState("Entry Level");

  const [website,setWebsite] =
    useState("LinkedIn");

  const [jobsCount,setJobsCount] =
    useState(10);


  const [loading,setLoading] =
    useState(false);

  const [status,setStatus] =
    useState("");

  const [error,setError] =
    useState("");



async function handleUpload(){


if(!user){

 setError("Please login first");

 return;

}



if(!file){

 setError("Please upload resume");

 return;

}



if(!location.trim()){

 setError("Please enter location");

 return;

}



try{


setLoading(true);

setError("");



setStatus(
"Uploading Resume..."
);



const upload =
await uploadResume(file);



localStorage.setItem(
"resume_text",
upload.resume_text
);



setStatus(
"AI Agent Running..."
);



const workflow =
await runOrchestrator({

user_id:user.id,

resume_text:
upload.resume_text,

profile:{},

preferences:{

location,

department,

experience,

website,

jobs_count:jobsCount

}

});



localStorage.setItem(
"workflow_result",
JSON.stringify(workflow)
);



localStorage.setItem(
"resume_uploaded",
"true"
);



setStatus(
"Completed"
);



if(inputRef.current){

inputRef.current.value="";

}



setFile(null);



setTimeout(()=>{

router.replace("/dashboard");

},500);



}
catch(err:any){


setError(
err.message ||
"Workflow failed"
);


}
finally{


setLoading(false);


}



}



return (

<div
className="
w-full
max-w-3xl
rounded-3xl
border
border-white/10
bg-[#0b0d12]
p-10
"
>


<h1
className="
text-3xl
font-bold
"
>

Upload Resume & Configure Agent

</h1>



<p
className="
mt-2
text-white/60
"
>

Tell AI what job you want.

</p>



<div className="mt-8 space-y-5">


<input

ref={inputRef}

type="file"

accept="application/pdf"

onChange={(e)=>
setFile(
e.target.files?.[0] || null
)
}

className="
w-full
rounded-xl
bg-white/5
p-3
"

/>



<input

value={location}

onChange={(e)=>
setLocation(e.target.value)
}

placeholder="Preferred Location"

className="
w-full
rounded-xl
bg-white/5
p-3
"

/>



<input

value={department}

onChange={(e)=>
setDepartment(e.target.value)
}

placeholder="Role (optional)"

className="
w-full
rounded-xl
bg-white/5
p-3
"

/>



<select

value={experience}

onChange={(e)=>
setExperience(e.target.value)
}

className="
w-full
rounded-xl
bg-white/5
p-3
"

>

<option>
Internship
</option>

<option>
Entry Level
</option>

<option>
Associate
</option>

<option>
Mid Level
</option>

<option>
Senior
</option>

</select>



<select

value={website}

onChange={(e)=>
setWebsite(e.target.value)
}

className="
w-full
rounded-xl
bg-white/5
p-3
"

>

<option>
LinkedIn
</option>

<option>
Naukri
</option>

<option>
Indeed
</option>


</select>


</div>



{
status &&

<p className="
mt-5
text-cyan-400
">

{status}

</p>

}



{
error &&

<p className="
mt-5
text-red-400
">

{error}

</p>

}




<button

onClick={handleUpload}

disabled={loading}

className="
mt-8
w-full
rounded-xl
bg-cyan-400
py-4
font-semibold
text-black
"

>

{
loading
?
"Running AI Agent..."
:
"🚀 Start AI Agent"
}


</button>


</div>


);


}
