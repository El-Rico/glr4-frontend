import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import invariant from "invariant";

// export async function loader() {}

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const { code, password, confirmPassword } = Object.fromEntries(formData);

	const url = process.env.STRAPI_URL || "http://localhost:1337";

	const response = await fetch(url + "/api/auth/reset-password", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json;charset=UTF-8",
		},
		body: JSON.stringify({
			code: code,
			password: password,
			passwordConfirmation: confirmPassword,
		}),
	});
	const data = await response.json();

	console.log(data);

	if (data.data === null) {
		return data.error.message;
	}

	return redirect("/login");
}

export default function passwordResetPage() {
	const actionData = useActionData<typeof action>();
	const [searchParams, setSearchParams] = useSearchParams();
	const code = searchParams.get("code");

	invariant(code, "Code is not provided");

	return (
		<>
			<h1 className="font-semibold text-xl mb-3">Wachtwoord herstellen</h1>
			<Form method="post">
				<div className="space-y-8 flex-col">
					<input type="hidden" name="code" value={code} />
					<label className="font-semibold block" htmlFor="password">
						Nieuw wachtwoord
					</label>
					<input
						className="block p-2 bg-orange-50 border border-solid ring:border-sky-600 w-full rounded-md border-gray-700 focus:border-sky-600 focus:ring-sky-600"
						id="password"
						type="password"
						name="password"
						required
					/>
					<label className="font-semibold block" htmlFor="password-confirm">
						Herhaal nieuw wachtwoord
					</label>
					<input
						className="block p-2 bg-orange-50 border border-solid ring:border-sky-600 w-full rounded-md border-gray-700 focus:border-sky-600 focus:ring-sky-600"
						id="password-confirm"
						type="password"
						name="confirmPassword"
						required
					/>
				</div>
				<button className="w-full rounded-md bg-sky-600 px-3 py-2 font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900">
					Vraag een nieuw wachtwoord aan
				</button>
			</Form>
		</>
	);
}
