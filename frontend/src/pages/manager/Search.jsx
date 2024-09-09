import React from "react";
import { RiMenuFold2Fill } from "react-icons/ri";
import { MdOutlineDarkMode } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";

const Search = () => {
  return (
    <div className="w-full p-5 bg-white text-black/70 h-[85px] rounded-l-sm sticky top-0 z-50">
      <div className="flex justify-between max-md:flex max-md:justify-end">
        <div className="flex gap-5 items-center w-[600px] max-md:hidden">
          {/* Sidebar toggle button */}

          {/* Search form */}
          <form className="flex items-center max-w-lg w-full ">
            <label htmlFor="voice-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full ">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none ">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 21 21"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="voice-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:border-gray-500 dark:placeholder-gray-500 dark:text-zinc-700 dark:focus:ring-blue-500 dark:focus:border-blue-500 duration-200 "
                placeholder="Search Stocks, Prices, Sell..."
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 end-0 flex items-center pe-3 duration-200"
              >
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7v3a5.006 5.006 0 0 1-5 5H6a5.006 5.006 0 0 1-5-5V7m7 9v3m-3 0h6M7 1h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z"
                  />
                </svg>
              </button>
            </div>
            <button
              type="submit"
              className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="w-4 h-4 me-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              Search
            </button>
          </form>
        </div>

        {/* Right-side icons and user profile */}
        <div className="flex gap-3 items-center">
          <MdOutlineDarkMode className="size-6 cursor-pointer" />
          <IoMdNotificationsOutline className="size-6 cursor-pointer" />
          <div className="dropdown dropdown-end">
            <img src="https://i.pinimg.com/736x/ea/21/05/ea21052f12b135e2f343b0c5ca8aeabc.jpg" tabIndex={0} role="button" alt="/" className="size-10 rounded-full" />
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white rounded-box z-[1] w-52 p-2 mt-2 shadow"
            >
              <li>
                <a>Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Log out</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
