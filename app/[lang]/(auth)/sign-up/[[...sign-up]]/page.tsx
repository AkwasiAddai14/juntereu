import Footer from "@/app/[lang]/components/shared/navigation/Footer4";
import NavBar from "@/app/[lang]/components/shared/navigation/Navigation";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
    <NavBar />
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="flex items-center justify-center w-full">
        <SignUp path="/sign-up"/>
      </div>
    </div>
    <Footer/>
    </>
)
}