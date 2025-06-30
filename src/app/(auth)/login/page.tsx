"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (status === "loading") return;
		if (session?.user) {
			router.replace("/");
		}
	}, [session, status, router]);

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
			toast.success("Sign in successful!");
			router.push("/");
		} else {
			toast.error(res?.error || "Invalid email or password");
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
					name="email"
					type="email"
					placeholder="Email address"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full px-2 p-1 border border-gray-300 rounded mb-4"
				/>

				<label className="block mb-2 text-sm font-medium">Password</label>
				<input
					name="password"
					type="password"
					placeholder="Password"
					required
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="w-full px-2 p-1 border border-gray-300 rounded mb-4"
				/>

				<button
					type="submit"
					disabled={loading}
					className={`w-full py-2 px-4 cursor-pointer rounded font-semibold text-white transition duration-300 ease-in-out ${
						loading
							? "bg-blue-400 cursor-not-allowed"
							: "bg-blue-600 hover:bg-blue-700"
					}`}
				>
					{loading ? (
						<div className="flex items-center justify-center gap-2">
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Signing in...
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
