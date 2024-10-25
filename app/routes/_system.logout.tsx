import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/session";

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request.headers.get("cookie"));

	return redirect("/", {
		headers: {
			"Set-Cookie": await destroySession(session),
		},
	});
}

export default function LogoutPage() {
	return null;
}
