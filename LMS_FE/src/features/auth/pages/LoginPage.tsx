import { useState } from "react";
import { loginUser } from "../api/authApi";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";



const LoginPage = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //  Validation
  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleLogin = async () => {
    setSubmitted(true);

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      localStorage.setItem("token", res.token);
      const decodedToken: any = jwtDecode(res.token);
      // console.log("decoded token is", decodedToken);

      const role = decodedToken.role || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      //redirect to page based on role
      if (role === "Admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }

    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 to-black text-white">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 p-6">
        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
          alt="library"
          className="rounded-2xl object-cover w-full h-full shadow-2xl"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex w-full md:w-1/2 items-center justify-center">
        <div className="w-[380px] p-8 rounded-2xl backdrop-blur-xl bg-white/5 shadow-2xl space-y-4">

          <div>
            <h2 className="text-2xl font-semibold">📚 Library System</h2>
            <p className="text-sm text-gray-400">
              Welcome back, login to continue
            </p>
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email or Username"
              value={email}
              onBlur={() => handleBlur("email")}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-lg bg-white/5 border ${
                (touched.email || submitted) && errors.email
                  ? "border-red-500"
                  : "border-white/20"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            {(touched.email || submitted) && errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onBlur={() => handleBlur("password")}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded-lg bg-white/5 border ${
                (touched.password || submitted) && errors.password
                  ? "border-red-500"
                  : "border-white/20"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition`}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>

            {(touched.password || submitted) && errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <button
            onClick={handleLogin}
            className="w-full p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 font-semibold hover:scale-[1.02] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center text-gray-400">
            Forgot password?{" "}
            <span className="text-blue-400 cursor-pointer hover:underline">
              Reset
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;