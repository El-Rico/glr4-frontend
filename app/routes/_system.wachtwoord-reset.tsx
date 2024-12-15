import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import invariant from "invariant";

// export async function loader() {}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { code, password, confirmPassword } = Object.fromEntries(formData);

  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:1337"
      : "https://srv636619.hstgr.cloud";

  const response = await fetch(baseURL + "/api/auth/reset-password", {
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
      <h1 className="mb-3 text-xl font-semibold">Wachtwoord herstellen</h1>
      <Form method="post">
        <div className="flex-col space-y-8">
          <input type="hidden" name="code" value={code} />
          <label className="block font-semibold" htmlFor="password">
            Nieuw wachtwoord
          </label>
          <input
            className="ring:border-sky-600 block w-full rounded-md border border-solid border-gray-700 bg-orange-50 p-2 focus:border-sky-600 focus:ring-sky-600"
            id="password"
            type="password"
            name="password"
            required
          />
          <label className="block font-semibold" htmlFor="password-confirm">
            Herhaal nieuw wachtwoord
          </label>
          <input
            className="ring:border-sky-600 block w-full rounded-md border border-solid border-gray-700 bg-orange-50 p-2 focus:border-sky-600 focus:ring-sky-600"
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
