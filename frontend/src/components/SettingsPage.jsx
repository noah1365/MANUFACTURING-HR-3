import { Link } from "react-router-dom";
import React,{ useEffect, useState } from "react";

const SettingsPage = () => {
    // const [isDarkMode, setIsDarkMode] = React.useState(false);

    // const toggleDarkMode = () => {
    //   setIsDarkMode((prev) => !prev);
    // };
  
    // useEffect(() => {
    //   if (isDarkMode) {
    //     document.body.classList.add('dark');
    //   } else {
    //     document.body.classList.remove('dark');
    //   }
    // }, [isDarkMode]);
	return (
		<div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-2xl">
			<div className="py-4 px-6 border-b border-gray-200 dark:border-gray-600">
				<h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
{/* 				<div className="flex items-center mt-4">
					<label className="text-gray-700 dark:text-gray-300 font-medium mr-2">Dark Mode:</label>
					<input
						type="checkbox"
						checked={isDarkMode}
						onChange={toggleDarkMode}
						className="toggle-checkbox"
					/>
				</div> */}
			</div>
			<main className="max-w-4xl mx-auto py-6 px-4 lg:px-8 space-y-8">
				<section className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
					<h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
						<Link to={`/profile`} className="text-blue-600 dark:text-blue-400 hover:underline">
							Profile
						</Link>
					</h2>
					<p className="text-neutral dark:text-gray-300">
						User profile settings, such as name, avatar, and email address.
					</p>
				</section>
				<section className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
					<h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
						<Link to={`/security`} className="text-blue-600 dark:text-blue-400 hover:underline">
							Security
						</Link>
					</h2>
					<p className="text-neutral dark:text-gray-300">
						Password settings and two-factor authentication options.
					</p>
				</section>
			</main>
		</div>
	);
};

export default SettingsPage;
