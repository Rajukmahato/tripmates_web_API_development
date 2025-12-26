import Navbar from "../_components/Navbar";
import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white w-[420px] p-8 rounded-2xl shadow-lg">
          <h1 className="text-2xl font-semibold text-center mb-8">
            Log in to TripMates
          </h1>

          <LoginForm />
        </div>
      </div>
    </>
  );
}

// import LoginForm from "../_components/LoginForm";

// export default function LoginPage() {
//   return <LoginForm />;
// }
