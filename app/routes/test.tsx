// import {
// 	ActionFunctionArgs,
// 	LoaderFunctionArgs,
// 	json,
// 	redirect,
// } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
// import { commitSession, getSession } from "~/session";

// export async function action({ request }: ActionFunctionArgs) {
// 	const formData = await request.formData();
// 	const { identifier, password } = Object.fromEntries(formData);

// 	const response = await fetch("http://localhost:1337/api/auth/local", {
// 		method: "POST",
// 		headers: {
// 			Accept: "application/json",
// 			"Content-Type": "application/json;charset=UTF-8",
// 		},
// 		body: JSON.stringify({
// 			identifier: identifier,
// 			password: password,
// 		}),
// 	});

// 	const data = await response.json();

// 	console.log(data);

// 	if (identifier === "info@web-etc.nl" && password === process.env.PASSWORD) {
// 		const session = await getSession();
// 		session.set("isAdmin", true);

// 		return redirect("/", {
// 			headers: {
// 				"Set-Cookie": await commitSession(session),
// 			},
// 		});
// 	} else {
// 		let error;

// 		if (!identifier) {
// 			error = "Identifier is required.";
// 		} else if (!password) {
// 			error = "Password is required.";
// 		} else {
// 			error = "Bad credentials.";
// 		}

// 		return json(
// 			{
// 				error,
// 			},
// 			401
// 		);
// 	}
// }

// export async function loader({ request }: LoaderFunctionArgs) {
// 	const session = await getSession(request.headers.get("cookie"));

// 	return session.data;
// }

export default function LoginPagetest() {
	// const data = useLoaderData<typeof loader>();
	// const actionData = useActionData<typeof action>();

	return (
		<div className="mx-auto mt-8 max-w-xs lg:max-w-sm">
			{data.isAdmin ? (
				<p>You're signed in.</p>
			) : (
				<Form method="post">
					<div className="space-y-2">
						<input
							className="ring:border-sky-600 w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
							type="text"
							name="identifier"
							required
							placeholder="Email"
						/>
						<input
							className="ring:border-sky-600 w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
							type="password"
							name="password"
							required
							placeholder="Password"
						/>
					</div>
					<button className="mt-8 w-full rounded-md bg-sky-600 px-3 py-2 font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900">
						Log in
					</button>

					{actionData?.error && (
						<p className="mt-4 font-medium text-red-500">{actionData.error}</p>
					)}
				</Form>
			)}
		</div>
	);
}
