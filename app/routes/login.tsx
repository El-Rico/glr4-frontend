import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { getSession, commitSession } from "~/session";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const { identifier, password } = Object.fromEntries(formData);
	const session = await getSession(request.headers.get("Cookie"));

	const response = await fetch("http://localhost:1337/api/auth/local", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json;charset=UTF-8",
		},
		body: JSON.stringify({
			identifier: identifier,
			password: password,
		}),
	});
	const data = await response.json();

	if (data.data === null) {
		return data.error.message;
	}

	session.set("isAuthenticated", true);
	session.set("userID", data.user.id);
	session.set("authToken", data.jwt);
	session.set("firstname", data.user.firstname);
	session.set("credit", data.user.credit);

	return redirect("/lessons", {
		headers: {
			"Set-Cookie": await commitSession(session),
		},
	});
}

export default function LoginPage() {
	const actionData = useActionData<typeof action>();

	return (
		<>
			<h1 className="font-semibold text-xl mb-3">Log in</h1>
			<Form method="post">
				<div className="space-y-2">
					<input
						className="p-2 bg-orange-50 border border-solid ring:border-sky-600 w-full rounded-md border-gray-700 focus:border-sky-600 focus:ring-sky-600"
						type="text"
						name="identifier"
						required
						placeholder="Gebruikersnaam/emailadres"
					/>
					<input
						className="p-2 bg-orange-50 border border-solid ring:border-sky-600 w-full rounded-md border-gray-700 focus:border-sky-600 focus:ring-sky-600"
						type="password"
						name="password"
						required
						placeholder="Password"
					/>
				</div>
				{actionData ? (
					<p className="text-red-600 font-bold">
						De logingegevens zijn niet correct
					</p>
				) : (
					""
				)}
				<button className="mt-8 w-full rounded-md bg-sky-600 px-3 py-2 font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900">
					Log in
				</button>
			</Form>
		</>
	);
}
