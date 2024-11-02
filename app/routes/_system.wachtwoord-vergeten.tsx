import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { emailaddress } = Object.fromEntries(formData);

  const url = process.env.STRAPI_URL || "http://localhost:1337";

  const response = await fetch(url + "/api/auth/forgot-password", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      email: emailaddress,
    }),
  });
  const data = await response.json();

  if (data.data === null) {
    return data.error.message;
  }

  return data;
}

export default function passwordForgotPage() {
  const actionData = useActionData<typeof action>();

  return (
    <>
      <h1 className="mb-3 text-xl font-semibold">Wachtwoord vergeten</h1>
      <p>
        Vul hieronder je e-mailadres in om een nieuw wachtwoord aan te vragen.
      </p>
      <Form method="post">
        <div className="mb-3 space-y-2">
          <label className="font-semibold" htmlFor="email">
            E-mailadres
          </label>
          <input
            className="ring:border-sky-600 w-full rounded-md border border-solid border-gray-700 bg-orange-50 p-2 focus:border-sky-600 focus:ring-sky-600"
            id="email"
            type="email"
            name="emailaddress"
            required
            placeholder="jouw@mailadres.nl"
          />
        </div>
        {actionData && <p>xxx</p>}
        <button className="w-full rounded-md bg-sky-600 px-3 py-2 font-medium text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900">
          Vraag een nieuw wachtwoord aan
        </button>
      </Form>
    </>
  );
}
