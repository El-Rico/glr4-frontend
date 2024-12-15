import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { getSession, commitSession } from "~/session";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { identifier, password } = Object.fromEntries(formData);
  const session = await getSession(request.headers.get("Cookie"));
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:1337"
      : "https://srv636619.hstgr.cloud";

  const response = await fetch(baseURL + "/api/auth/local", {
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

  const redirectTo = !data.user.acceptedterms
    ? "/accepteer-voorwaarden"
    : "/lessons";

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  if (typeof actionData === "string") {
    console.log("dat ging fout");
  }

  return (
    <>
      <h1 className="mb-3 text-xl font-semibold">Log in</h1>
      <Form method="post">
        <div className="space-y-2">
          <input
            className="ring:border-sky-600 w-full rounded-md border border-solid border-gray-700 bg-orange-50 p-2 focus:border-sky-600 focus:ring-sky-600"
            type="text"
            name="identifier"
            required
            placeholder="Gebruikersnaam/emailadres"
          />
          <input
            className="ring:border-sky-600 w-full rounded-md border border-solid border-gray-700 bg-orange-50 p-2 focus:border-sky-600 focus:ring-sky-600"
            type="password"
            name="password"
            required
            placeholder="Password"
          />
          <p>
            <Link
              to="/wachtwoord-vergeten"
              className="underline hover:no-underline"
            >
              Ik ben mijn wachtwoord vergeten
            </Link>
          </p>
        </div>
        {actionData ? (
          <p className="font-bold text-red-600">
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
