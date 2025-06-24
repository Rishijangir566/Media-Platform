import { useState } from "react";
import { FaGithub, FaLinkedin, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

function Home() {


const [form, setForm] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login submitted:", form);
  };

 


  function handleGitHubLogin() {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;

    const redirectUri = `${window.location.origin}/github-callback`;

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=user`;
    window.location.href = githubAuthUrl;
  }

  function handleGoogleLogin() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = "http://localhost:5173/google/callback";
    const scope =
      "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
    const responseType = "code";

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${encodeURIComponent(
      scope
    )}&access_type=offline`;

    window.location.href = authUrl;
  }
  

  const handleLinkedinLogin = () => {
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;

  // ✅ This should match the same redirect_uri used in backend + LinkedIn App
  const redirectUri = "http://localhost:5173/linkedin/callback";

  const scope = ["openid", "profile", "email"].join(" ");
  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}`;

  window.location.href = linkedinAuthUrl;
};

  return (
    <>
       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-gray-500 to-blue-900 p-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl p-8 w-full max-w-md shadow-2xl text-white relative">
        <h2 className="text-4xl font-extrabold text-center mb-6 tracking-wide">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/30 placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/30 placeholder-white focus:outline-none focus:ring-2 focus:ring-white/50"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-white text-purple-700 font-semibold hover:bg-gray-200 transition"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm opacity-80">or sign in with</div>

        <div className="flex justify-center gap-6 text-4xl mt-4">
          <FaGoogle
            onClick={handleGoogleLogin}
            className="cursor-pointer hover:scale-110 transition text-red-400 bg-white/20 p-2 rounded-full"
          />
          <FaGithub
            onClick={handleGitHubLogin}
            className="cursor-pointer hover:scale-110 transition text-white bg-white/20 p-2 rounded-full"
          />
          <FaLinkedin
            onClick={handleLinkedinLogin}
            className="cursor-pointer hover:scale-110 transition text-blue-400 bg-white/20 p-2 rounded-full"
          />
        </div>

        <div className="text-center mt-6 text-sm">
          Don't have an account?  {" "}
          <Link to={"/register"} className="text-blue-900">
             Register
          </Link>
        
        </div>

        {/* Optional: floating background effects */}
        <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-purple-400/30 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-[-40px] left-[-20px] w-32 h-32 bg-pink-500/20 rounded-full blur-2xl animate-pulse"></div>
      </div>
    </div>
    </>
  );
}

export default Home;
