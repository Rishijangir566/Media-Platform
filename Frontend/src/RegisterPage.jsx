import { useState } from "react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Registering:", form);
    // Call your backend register API here
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br
     from-blue-900 via-gray-500 to-indigo-900 p-4"
    >
      <div className="backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl p-8 w-full max-w-md shadow-2xl text-white relative">
        <h2 className="text-4xl font-extrabold text-center mb-6 tracking-wide">
          Create Account 🚀
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleInputChange}
            required
            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/30 placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleInputChange}
            required
            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/30 placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            required
            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/30 placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleInputChange}
            required
            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/30 placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-white text-purple-700 font-semibold hover:bg-gray-200 transition"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          Already have an account?{" "}
           <Link to={"/"} className="text-blue-900">
            Sign In
          </Link>
        </div>

        {/* Optional: floating background effects */}
        <div className="absolute top-[-30px] left-[-30px] w-24 h-24 bg-pink-500/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-[-40px] right-[-20px] w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default RegisterPage;
