import { useState } from "react";

const Security = () => {
	const [isEnabled, setIsEnabled] = useState(false);
	const [verificationCode, setVerificationCode] = useState("");

	const handleEnableToggle = () => {
		setIsEnabled(!isEnabled);
	};

	const handleCodeChange = (e) => {
		setVerificationCode(e.target.value);
	};

	return (
		<div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-2xl">
			<h1 className="text-2xl font-bold text-gray-800 mb-4">Two-Factor Authentication</h1>

			{/* Enable/Disable 2FA */}
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-lg font-semibold text-gray-700">Enable Two-Factor Authentication</h2>
				<button
					className={`px-4 py-2 rounded-lg font-semibold ${
						isEnabled ? "bg-red-500 text-white" : "bg-blue-500 text-white"
					}`}
					onClick={handleEnableToggle}
				>
					{isEnabled ? "Disable" : "Enable"}
				</button>
			</div>

			{/* Verification Code Input */}
			{isEnabled && (
				<div className="bg-gray-100 p-6 rounded-lg">
					<p className="text-gray-600 mb-4">
						Enter the verification code sent to your mobile device to complete setup.
					</p>
					<input
						type="text"
						placeholder="Enter 6-digit code"
						value={verificationCode}
						onChange={handleCodeChange}
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
					/>
					<button
						className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
					>
						Verify Code
					</button>
				</div>
			)}
		</div>
	);
};

export default Security;
