import type { Metadata } from "next";
import ClientLogin from "./ClientLogin";

export const metadata: Metadata = {
	title: "Island Quiz - Login",
	description: "Island Quiz"
};

export default function LoginPage() {
	return <ClientLogin />;
}