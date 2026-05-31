import Image from "next/image";

let data:string;
export default function Home() {
  const fetchSomething = async ()=>{
    try {
      const res = await fetch("https://where-it-went-backend.onrender.com/api/v1/health");
      data = JSON.stringify(res.json());
    } catch (error:any) {
      data = "error";
    }
  }


  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {
        data
      }
    </div>
  );
}
