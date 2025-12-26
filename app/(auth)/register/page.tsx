import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[420px] p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-semibold text-center mb-8">
          Create your TripMates account
        </h1>

        <RegisterForm />
      </div>
    </div>
  );
}
// import RegisterForm from "../_components/RegisterForm";

// export default function RegisterPage() {
//   return <RegisterForm />;
// }
