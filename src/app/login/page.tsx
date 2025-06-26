"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const res = await signIn("credentials", {
			email,
			password,
			redirect: false
		});

		setLoading(false);

		if (res?.ok) {
			router.push("/");
		} else {
			toast.error("Invalid email or password");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<form
				onSubmit={handleLogin}
				className="bg-white p-8 rounded shadow-md w-full max-w-md"
			>
				<h2 className="text-2xl font-bold mb-4 mt-6">Welcome back</h2>
				<label className="block mb-2 text-sm font-medium">Email</label>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full p-1 border border-gray-300 rounded mb-4"
					required
				/>
				<label className="block mb-2 text-sm font-medium">Password</label>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full p-1 border border-gray-300 rounded mb-4"
					required
				/>
				<button
					type="submit"
					disabled={loading}
					className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
				>
					{loading ? (
						<div className="flex items-center justify-center gap-2">
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Sign in...
						</div>
					) : (
						"Sign in"
					)}
				</button>
				<p className="text-sm text-center mt-4">
					Don&apos;t have an account?{" "}
					<Link href="/register" className="text-blue-500 hover:underline">
						Sign up
					</Link>
				</p>
			</form>
		</div>
	);
}
