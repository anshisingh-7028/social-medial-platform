import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(formData);
      navigate("/home");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div
        className="
          hidden lg:flex
          w-1/2
          min-h-screen
          relative
          bg-cover
          bg-center
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=90')",
        }}
      >

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/95 via-purple-900/70 to-pink-900/80" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24 text-white">

          <div
            className="
              w-16 h-16
              rounded-2xl
              flex items-center justify-center
              bg-gradient-to-br from-pink-400 to-purple-600
              text-3xl font-extrabold
              shadow-2xl
              mb-7
            "
          >
            S
          </div>

          <h1 className="text-6xl xl:text-7xl font-extrabold tracking-tight">
            Socially
          </h1>

          <p className="text-2xl font-semibold mt-4">
            Connect. Share. Discover.
          </p>

          <p className="text-white/70 mt-4 max-w-md leading-7">
            Your world, your people, your stories.
            Connect with people and share the moments
            that matter to you.
          </p>

        </div>
      </div>


      {/* RIGHT SIDE */}
      <div
        className="
          w-full lg:w-1/2
          min-h-screen
          flex items-center justify-center
          bg-slate-100
          px-5 py-10
        "
      >

        <div
          className="
            w-full max-w-md
            bg-white
            rounded-3xl
            shadow-2xl
            p-7 sm:p-10
          "
        >

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">

            <div
              className="
                w-14 h-14
                rounded-2xl
                flex items-center justify-center
                bg-gradient-to-br
                from-pink-500 to-purple-600
                text-white
                text-2xl
                font-extrabold
                shadow-lg
              "
            >
              S
            </div>

          </div>


          {/* Heading */}
          <h2
            className="
              text-3xl
              font-extrabold
              text-slate-900
              text-center lg:text-left
            "
          >
            Welcome Back 👋
          </h2>

          <p
            className="
              text-slate-500
              text-sm
              mt-2
              text-center lg:text-left
            "
          >
            Login to continue to Socially
          </p>


          {/* Error */}
          {error && (
            <div
              className="
                mt-6
                px-4 py-3
                rounded-xl
                bg-red-50
                border border-red-100
                text-red-600
                text-sm
                font-medium
              "
            >
              ⚠️ {error}
            </div>
          )}


          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            {/* Email */}
            <div>

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-2
                "
              >
                Email Address
              </label>

              <div className="relative">

                <span
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                >
                  ✉
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    h-12
                    pl-11 pr-4
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    outline-none
                    text-sm
                    text-slate-900
                    placeholder:text-slate-400
                    transition
                    focus:bg-white
                    focus:border-purple-500
                    focus:ring-4
                    focus:ring-purple-100
                  "
                />

              </div>

            </div>


            {/* Password */}
            <div>

              <label
                className="
                  block
                  text-sm
                  font-semibold
                  text-slate-700
                  mb-2
                "
              >
                Password
              </label>

              <div className="relative">

                <span
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                >
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    h-12
                    pl-11 pr-12
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    outline-none
                    text-sm
                    transition
                    focus:bg-white
                    focus:border-purple-500
                    focus:ring-4
                    focus:ring-purple-100
                  "
                />

                {/* Eye Button */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    w-9 h-9
                    rounded-lg
                    flex items-center justify-center
                    hover:bg-slate-100
                    transition
                    cursor-pointer
                  "
                >
                  {showPassword
                    ? "👁️"
                    : "👁️‍🗨️"}
                </button>

              </div>

            </div>


            {/* Forgot Password */}
            <div className="flex justify-end">

              <button
                type="button"
                className="
                  text-sm
                  font-semibold
                  text-purple-600
                  hover:text-purple-700
                "
                onClick={() =>
                  alert(
                    "Forgot password will be added later."
                  )
                }
              >
                Forgot Password?
              </button>

            </div>


            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-12
                rounded-xl
                bg-gradient-to-r
                from-purple-600
                to-pink-500
                text-white
                font-bold
                text-sm
                shadow-lg
                shadow-purple-200
                hover:shadow-xl
                hover:-translate-y-0.5
                active:translate-y-0
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
                disabled:hover:translate-y-0
                cursor-pointer
              "
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>


          {/* Divider */}
          <div className="flex items-center gap-4 my-7">

            <div className="h-px bg-slate-200 flex-1" />

            <span className="text-xs text-slate-400 font-semibold">
              OR
            </span>

            <div className="h-px bg-slate-200 flex-1" />

          </div>


          {/* Register */}
          <p
            className="
              text-center
              text-sm
              text-slate-500
            "
          >
            Don't have an account?

            <Link
              to="/register"
              className="
                ml-1
                font-bold
                text-purple-600
                hover:text-purple-700
              "
            >
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;