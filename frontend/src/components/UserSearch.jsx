import { useState } from "react";
import { Link } from "react-router-dom";
import { searchUsers } from "../services/userApi";

const UserSearch = () => {

  const [query, setQuery] =
    useState("");

  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);


  const handleSearch = async (
    e
  ) => {

    const value =
      e.target.value;

    setQuery(value);

    if (!value.trim()) {
      setUsers([]);
      return;
    }

    try {

      setLoading(true);

      const data =
        await searchUsers(value);

      setUsers(
        data.users || []
      );

    } catch (error) {

      console.error(
        "Search error:",
        error
      );

      setUsers([]);

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="relative w-full">

      {/* SEARCH INPUT */}

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
          🔍
        </span>

        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search people..."
          className="
            h-11
            w-full
            rounded-full
            border
            border-slate-200
            bg-slate-100
            pl-11
            pr-4
            text-sm
            outline-none
            transition
            focus:border-purple-400
            focus:bg-white
            focus:ring-4
            focus:ring-purple-100
          "
        />

      </div>


      {/* RESULTS */}

      {query && (
        <div
          className="
            absolute
            left-0
            right-0
            top-14
            z-50
            max-h-96
            overflow-y-auto
            rounded-2xl
            border
            border-slate-200
            bg-white
            p-2
            shadow-2xl
          "
        >

          {loading && (
            <div className="p-4 text-center text-sm text-slate-500">
              Searching...
            </div>
          )}


          {!loading &&
            users.length === 0 && (
              <div className="p-4 text-center text-sm text-slate-500">
                No users found
              </div>
            )}


          {!loading &&
            users.map((item) => {

              const avatar =
                item.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  item.name
                )}&background=7c3aed&color=fff`;

              return (
                <Link
                  key={item._id}
                  to={`/user/${item._id}`}
                  onClick={() =>
                    setQuery("")
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    p-3
                    transition
                    hover:bg-slate-50
                  "
                >

                  <img
                    src={avatar}
                    alt={item.name}
                    className="
                      h-11
                      w-11
                      rounded-full
                      object-cover
                    "
                  />

                  <div className="min-w-0">

                    <p className="truncate text-sm font-bold text-slate-900">
                      {item.name}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      @{item.username}
                    </p>

                  </div>

                </Link>
              );
            })}

        </div>
      )}

    </div>
  );
};

export default UserSearch;