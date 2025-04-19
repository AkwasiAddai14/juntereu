import Footer from "@/app/[lang]/components/shared/navigation/Footer4";
import NavBar from "@/app/[lang]/components/shared/navigation/NavBar";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <NavBar lang={"en"} />
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      <div className="flex items-center justify-center w-full">
          <SignIn path="/sign-in" />
        </div>
      </div>
      <Footer />
    </>
  );
}
