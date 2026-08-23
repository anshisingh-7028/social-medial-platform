import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import CreatePost from "../components/CreatePost";

const Create = () => {
  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        pb-20
        lg:pb-0
      "
    >
      <Navbar />

      <div
        className="
          mx-auto
          flex
          max-w-7xl
          gap-6
          px-4
          py-6
          sm:px-6
        "
      >
        <Sidebar />

        <main className="min-w-0 flex-1">
          <div className="mb-6">
            <h1
              className="
                text-2xl
                font-extrabold
                text-slate-900
                sm:text-3xl
              "
            >
              Create Post
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Share something with your
              followers.
            </p>
          </div>

          <CreatePost />
        </main>
      </div>

      <MobileNav />
    </div>
  );
};

export default Create;