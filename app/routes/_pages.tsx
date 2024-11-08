import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Header from "~/components/header";
import { getSession } from "~/session";

export const meta: MetaFunction = () => {
  return [
    { title: "GL Lesportaal" },
    { name: "description", content: "Reserveer en plan je lessen hier" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  return {
    isAuthenticated: session.has("isAuthenticated"),
  };
}

export default function PagesLayout() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <Header isAuthenticated={loaderData.isAuthenticated} />
      <main className="mx-auto max-w-3xl rounded-md border border-gray-300 bg-white bg-opacity-80 p-4">
        <Outlet />
      </main>
    </>
  );
}
