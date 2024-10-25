import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { acceptTerms } from "~/data.server";
import { getSession } from "~/session";

interface Lesson {
  id: string;
  attributes: {
    date: string;
  };
}

// export async function loader({ request }: LoaderFunctionArgs) {
//   const session = await getSession(request.headers.get("Cookie"));
//   const isAuthenticated = session.has("isAuthenticated");
//   if (!isAuthenticated) return redirect("/");

//   const userID = session.get("userID");
//   const authToken = session.get("authToken");
//   return { userID, authToken };
// }

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isAuthenticated = session.has("isAuthenticated");
  if (!isAuthenticated) return redirect("/");

  const userID = session.get("userID");
  const authToken = session.get("authToken");
  const formData = await request.formData();
  if (formData.get("accept_terms") !== "YES") {
    throw new Error("Er gaat iets mis");
  }

  acceptTerms(userID, authToken);

  return redirect("/lessons");
}

export default function LessonsPage() {
  //   const { userID, authToken } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="mx-auto mt-3 max-w-3xl rounded-md border border-gray-300 bg-white bg-opacity-80 p-4">
        <h1 className="mb-3 text-xl font-semibold">Accepteer de voorwaarden</h1>
        <p>
          De eerste keer dat je inlogt vragen wij je of je de voorwaarden eerst
          wilt accepteren.
        </p>
        <Form method="POST">
          <label className="flex cursor-pointer items-center align-middle">
            <input
              className="mr-2"
              type="checkbox"
              value="YES"
              name="accept_terms"
              required
            />{" "}
            <span>Ik accepteer de algemene voorwaarden.</span>
          </label>
          <Button
            type="submit"
            className="text-md mr-2 mt-2 bg-green-600 font-bold"
          >
            Accepteren
          </Button>
          <Button
            type="button"
            asChild
            variant="destructive"
            className="text-md"
          >
            <Link to="/logout">Niet accepteren (uitloggen)</Link>
          </Button>
        </Form>
      </div>
    </>
  );
}
