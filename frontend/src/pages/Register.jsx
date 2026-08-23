import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
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
      await register(formData);

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT */}
      <div
        className="
          hidden lg:flex
          w-1/2
          min-h-screen
          relative
          bg-cover bg-center
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1400&q=90')",
        }}
      >

        <div
          className="
            absolute inset-0
            bg-gradient-to-br
            from-purple-950/95
            via-purple-900/70
            to-pink-900/80
          "
        />

        <div
          className="
            relative z-10
            flex flex-col
            justify-center
            px-16 xl:px-24
            text-white
          "
        >

          <div
            className="
              w-16 h-16
              rounded-2xl
              flex items-center justify-center
              bg-gradient-to-br
              from-pink-400 to-purple-600
              text-3xl
              font-extrabold
              shadow-2xl
              mb-7
            "
          >
            S
          </div>

          <h1 className="text-6xl xl:text-7xl font-extrabold">
            Socially
          </h1>

          <p className="text-2xl font-semibold mt-4">
            Your story starts here.
          </p>

          <p className="text-white/70 mt-4 max-w-md leading-7">
            Create your account, connect with
            friends and share the moments that
            matter to you.
          </p>

        </div>

      </div>


      {/* RIGHT */}
      <div
        className="
          w-full lg:w-1/2
          min-h-screen
          flex items-center justify-center
          bg-slate-100
          px-5 py-8
        "
      >

        <div
          className="
            w-full
            max-w-lg
            bg-white
            rounded-3xl
            shadow-2xl
            p-7 sm:p-10
          "
        >

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-5">

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
              "
            >
              S
            </div>

          </div>


          <h2
            className="
              text-3xl
              font-extrabold
              text-slate-900
              text-center
            "
          >
            Create Account ✨
          </h2>

          <p
            className="
              text-slate-500
              text-sm
              text-center
              mt-2
            "
          >
            Join Socially and connect with everyone
          </p>


          {error && (
            <div
              className="
                mt-6
                p-3
                rounded-xl
                bg-red-50
                border border-red-100
                text-red-600
                text-sm
              "
            >
              ⚠️ {error}
            </div>
          )}


          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >

            {/* Name */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Anshika Singh"
                value={formData.name}
                onChange={handleChange}
                required
                className="
                  w-full h-12
                  px-4
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  outline-none
                  text-sm
                  focus:bg-white
                  focus:border-purple-500
                  focus:ring-4
                  focus:ring-purple-100
                "
              />

            </div>


            {/* Username */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Username
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  @
                </span>

                <input
                  type="text"
                  name="username"
                  placeholder="anshika"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="
                    w-full h-12
                    pl-10 pr-4
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    outline-none
                    text-sm
                    focus:bg-white
                    focus:border-purple-500
                    focus:ring-4
                    focus:ring-purple-100
                  "
                />

              </div>

            </div>


            {/* Email */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="
                  w-full h-12
                  px-4
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  outline-none
                  text-sm
                  focus:bg-white
                  focus:border-purple-500
                  focus:ring-4
                  focus:ring-purple-100
                "
              />

            </div>


            {/* Password */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="
                    w-full h-12
                    pl-4 pr-12
                    rounded-xl
                    border border-slate-200
                    bg-slate-50
                    outline-none
                    text-sm
                    focus:bg-white
                    focus:border-purple-500
                    focus:ring-4
                    focus:ring-purple-100
                  "
                />

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
                    hover:bg-slate-100
                    cursor-pointer
                  "
                >
                  {showPassword
                    ? "👁️"
                    : "👁️‍🗨️"}
                </button>

              </div>

              <p className="text-xs text-slate-400 mt-2">
                Minimum 6 characters
              </p>

            </div>


            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full h-12
                mt-2
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
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
                cursor-pointer
              "
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          {/* Divider */}
          <div className="flex items-center gap-4 my-6">

            <div className="h-px bg-slate-200 flex-1" />

            <span className="text-xs text-slate-400">
              OR
            </span>

            <div className="h-px bg-slate-200 flex-1" />

          </div>


          <p className="text-center text-sm text-slate-500">

            Already have an account?

            <Link
              to="/login"
              className="
                ml-1
                font-bold
                text-purple-600
                hover:text-purple-700
              "
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Register;