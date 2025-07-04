import type { Metadata } from "next";
import ClientRegister from "./ClientRegister";

export const metadata: Metadata = {
	title: "Island Quiz - Register",
	description: "Island Quiz"
};

export default function RegisterPage() {
	return <ClientRegister />;
}