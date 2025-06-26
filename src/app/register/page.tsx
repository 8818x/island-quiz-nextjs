"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
	const router = useRouter();
	const [form, setForm] = useState({
		displayname: "",
		username: "",
		email: "",
		password: ""
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({
			...form,
			[e.target.name]: e.target.value
		});
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const res = await fetch("/api/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(form)
		});

		setLoading(false);

		if (res.ok) {
			toast.success("Registration successful");
			router.push("/login");
		} else {
			const data = await res.json();
			toast.error(data.error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<form
				onSubmit={handleRegister}
				className="bg-white p-8 rounded shadow-md w-full max-w-md"
			>
				<h2 className="text-2xl font-bold mb-6">Get Started</h2>

				<label className="block mb-2 text-sm font-medium">Username</label>
				<input
					name="displayname"
					type="text"
					value={form.displayname}
					onChange={handleChange}
					required
					className="w-full p-1 border border-gray-300 rounded mb-4"
				/>

				<label className="block mb-2 text-sm font-medium">Name</label>
				<input
					name="username"
					type="text"
					value={form.username}
					onChange={handleChange}
					required
					className="w-full p-1 border border-gray-300 rounded mb-4"
				/>

				<label className="block mb-2 text-sm font-medium">Email</label>
				<input
					name="email"
					type="email"
					value={form.email}
					onChange={handleChange}
					required
					className="w-full p-1 border border-gray-300 rounded mb-4"
				/>

				<label className="block mb-2 text-sm font-medium">Password</label>
				<input
					name="password"
					type="password"
					value={form.password}
					onChange={handleChange}
					required
					className="w-full p-1 border border-gray-300 rounded mb-4"
				/>

				<button
					type="submit"
					disabled={loading}
					className={`w-full py-2 px-4 rounded font-semibold text-white transition 
            ${
							loading
								? "bg-blue-400 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700"
						}`}
				>
					{loading ? (
						<div className="flex items-center justify-center gap-2">
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Sign up...
						</div>
					) : (
						"Sign up"
					)}
				</button>

				<p className="mt-4 text-sm text-center text-gray-600">
					Already have an account?{" "}
					<Link href="/login" className="text-blue-600 hover:underline">
						Sign in
					</Link>
				</p>
			</form>
		</div>
	);
}
