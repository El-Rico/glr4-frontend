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
			<h1 className="font-semibold text-xl mb-3">Je aankomende lessen</h1>
			<div>
				{credit > 0 && <CreditItem credit={credit} showButton={true} />}
				{loadedLessons.data.map((lesson: Lesson) => (
					<LessonItem
						key={lesson.id}
						id={lesson.id}
						date={lesson.attributes.date}
						showButton={true}
					/>
				))}
			</div>
			<Outlet />
		</>
	);
}
