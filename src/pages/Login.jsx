import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
// import lady from "../assets/nit.png";

function Login() {

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {

      const result = await signInWithPopup(auth, provider);

      const user = {
        name: result.user.displayName,
        email: result.user.email
      };

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Google login failed");
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const user = {
      email,
      name: email.split("@")[0]
    };

    localStorage.setItem("user", JSON.stringify(user));

    navigate("/");

  };

  return (

    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 gap-10">

  {/* Logo */}
  <div>
    <h1 className="font-montserrat font-extrabold text-5xl tracking-tight text-white">
      LosT <span className="text-blue-500 text-3xl font-medium">& Found</span>
    </h1>
  </div>

  {/* Login Card */}
  <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-10 border border-blue-200">

    <h1 className="text-center font-montserrat font-extrabold text-4xl tracking-tight">
      WelcomE <span className="text-blue-500 text-2xl font-medium">BacK</span>
    </h1>

    <p className="text-center text-gray-500 mt-2 mb-6">
      Hey! Good to see you again
    </p>

    <button
      onClick={handleGoogleLogin}
      className="w-full border border-blue-300 rounded-lg py-2 mb-4 hover:bg-blue-50 transition font-medium"
    >
      Continue with Google
    </button>

    <div className="text-center text-sm text-gray-500 mb-4">
      Or sign in with email
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="text-sm text-gray-600">Email</label>

        <input
          type="email"
          className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Password</label>

        <input
          type="password"
          className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="w-full py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition font-semibold">
        Login
      </button>

    </form>

    <p className="text-center text-sm mt-6 text-gray-600">
      Don't have an account?
      <span
        onClick={() => navigate("/signup")}
        className="text-blue-600 cursor-pointer ml-1 hover:underline"
      >
        Sign up
      </span>
    </p>

  </div>

</div>
  );

}

export default Login;