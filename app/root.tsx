import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
} from "@remix-run/react";

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import stylesheet from "~/tailwind.css?url";
import { getSession } from "./session";
import Header from "./components/header";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request.headers.get("Cookie"));
	return {
		isAuthenticated: session.has("isAuthenticated"),
	};
}

export default function App() {
	const loaderData = useLoaderData<typeof loader>();
	return (
		<div className="mx-auto max-w-xl lg:max-w-7xl">
			<Header isAuthenticated={loaderData.isAuthenticated} />
			<main className="mx-auto max-w-3xl p-4 bg-white bg-opacity-90 border border-gray-300 rounded-md">
				<Outlet />
			</main>
		</div>
	);
}
