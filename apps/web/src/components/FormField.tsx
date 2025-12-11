// import React, { useState } from "react";
// import { Label } from "./ui/label";
// import { Input } from "./ui/input";

// function FormField({title,type,id}:{title:string,type:string}) {
//     // const FieldField = useState()
//     const [isEditing,setIsEditing]=useState<boolean>(false)
//     const handleBlur = () => setIsEditing(false);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") setIsEditing(false);
//   };

    
//   return (
//     <div>

//   {isEditing ? (
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             onBlur={handleBlur}
//             onKeyDown={handleKeyDown}
//             autoFocus
//             className="border-b border-teal-600 bg-transparent text-xl font-semibold focus:outline-none px-2"
//           />
//         ) : (
//           <h1
//             className="text-xl font-semibold cursor-pointer hover:text-teal-500 transition"
//             onClick={() => setIsEditing(true)}
//           >
//             {title}
//           </h1>)}
        
//       <Label>{f.title}</Label>
//       <Input type={f.type}></Input>
//     </div>
//   );
// }

// export default FormField;
