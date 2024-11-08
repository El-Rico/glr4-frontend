import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  type BlocksContent,
  BlocksRenderer,
} from "@strapi/blocks-react-renderer";
import invariant from "invariant";
import { getPageContent } from "~/data.server";
import { getSession } from "~/session";

export const meta: MetaFunction = () => {
  return [
    { title: "GL Lesportaal" },
    { name: "description", content: "Reserveer en plan je lessen hier" },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isAuthenticated = session.has("isAuthenticated");
  if (!isAuthenticated) return redirect("/");
  const authToken = session.get("authToken");

  invariant(params.slug, "Expected slug");
  const data = getPageContent(params.slug, authToken);
  return data;
}

export default function ContentPage() {
  const pageData = useLoaderData<typeof loader>();

  return (
    <>
      <h1 className="text-2xl font-medium">{pageData.data.attributes.title}</h1>
      <BlocksRenderer content={pageData.data.attributes.content} />
    </>
  );
}
