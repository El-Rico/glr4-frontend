import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import CreditItem from "~/components/creditItem";
import LessonItem from "~/components/lessonItem";
import { getLessons } from "~/data.server";
import { getSession } from "~/session";

interface Lesson {
  id: string;
  attributes: {
    date: string;
    cancelled: boolean;
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const isAuthenticated = session.has("isAuthenticated");
  if (!isAuthenticated) return redirect("/");

  const userID = session.get("userID");
  const authToken = session.get("authToken");
  const credit = session.get("credit");
  const lessons = await getLessons(userID, authToken);
  return { loadedLessons: lessons, credit: credit };
}

export default function LessonsPage() {
  const { loadedLessons, credit } = useLoaderData<typeof loader>();

  return (
    <>
      {credit > 0 && <CreditItem credit={credit} showButton={true} />}
      <h1 className="mb-3 text-xl font-semibold">Je aankomende lessen</h1>
      <div>
        {!loadedLessons.data.length ? (
          <p>
            Er zijn nog geen lessen toegekend. Heb nog even geduld of neem
            contact op via{" "}
            <a
              className="underline hover:no-underline"
              href="mailto:info@genevievelumeij.nl"
              title="Stuur een mail naar info@genevievelumeij.nl"
            >
              e-mail
            </a>{" "}
            of Whatsapp.
          </p>
        ) : (
          loadedLessons.data.map((lesson: Lesson) => (
            <LessonItem
              key={lesson.id}
              id={lesson.id}
              date={lesson.attributes.date}
              showButton={true}
              cancelled={lesson.attributes.cancelled}
            />
          ))
        )}
      </div>
      <Outlet />
    </>
  );
}
