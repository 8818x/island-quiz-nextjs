"use client";

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { registerUser, type RegisterState } from "@/lib/actions";

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button
			type="submit"
			disabled={pending}
			className={`w-full py-2 px-4 cursor-pointer rounded font-semibold text-white transition duration-300 ease-in-out
      ${
				pending
					? "bg-blue-400 cursor-not-allowed"
					: "bg-blue-600 hover:bg-blue-700"
			}`}
		>
			{pending ? (
				<div className="flex items-center justify-center gap-2">
					<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
					Signing up...
				</div>
			) : (
				"Sign up"
			)}
		</button>
	);
}
export default function RegisterPage() {
	const router = useRouter();
	const initialState: RegisterState = {};
	const [state, formAction] = useActionState(registerUser, initialState);

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	useEffect(() => {
		if (state?.success) {
			toast.success(state.success);
			router.push("/login");
		}
		if (state?.error) {
			const form = document.getElementById("registerForm") as HTMLFormElement;
			if (form) {
				(form.elements.namedItem("password") as HTMLInputElement).value = "";
				(form.elements.namedItem("confirmPassword") as HTMLInputElement).value =
					"";
			}
			toast.error(state.error);
		}
	}, [state, router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<form
				id="registerForm"
				action={formAction}
				className="bg-white p-8 rounded shadow-md w-full max-w-md"
			>
				<h2 className="text-2xl font-bold mb-6">Get Started</h2>

				<div>
					<label className="block mb-2 text-sm font-medium">Name</label>
					<input
						id="name"
						name="displayname"
						type="text"
						placeholder="John Doe"
						required
						className="w-full p-1 px-2 border border-gray-300 rounded mb-4"
					/>
				</div>
				<div>
					<label className="block mb-2 text-sm font-medium">Username</label>
					<input
						id="username"
						name="username"
						type="text"
						placeholder="johndoe"
						required
						className="w-full p-1 px-2 border border-gray-300 rounded mb-4"
					/>
				</div>

				<div>
					<label className="block mb-2 text-sm font-medium">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						placeholder="your@example.com"
						required
						className="w-full p-1 px-2 border border-gray-300 rounded mb-4"
					/>
				</div>

				<div>
					<label className="block mb-2 text-sm font-medium" htmlFor="password">
						Password
					</label>
					<div className="relative mb-4">
						<input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							placeholder="••••••••"
							required
							className="w-full p-1 px-2 border border-gray-300 rounded"
						/>
						<button
							type="button"
							className="absolute top-1/2 right-0 pr-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
							onClick={() => setShowPassword(!showPassword)}
							aria-label="Toggle password visibility"
						>
							{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
				</div>

				<div>
					<label
						className="block mb-2 text-sm font-medium"
						htmlFor="confirmPassword"
					>
						Confirm Password
					</label>
					<div className="relative mb-4">
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showConfirmPassword ? "text" : "password"}
							placeholder="••••••••"
							required
							className="w-full p-1 px-2 border border-gray-300 rounded"
						/>
						<button
							type="button"
							className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							aria-label="Toggle confirm password visibility"
						>
							{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
						</button>
					</div>
				</div>

				<SubmitButton />

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
