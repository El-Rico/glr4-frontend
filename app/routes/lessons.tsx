import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getLessons } from "~/data.server";
import { getSession } from "~/session";

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request.headers.get("Cookie"));
	const userID = session.get("userID");
	const authToken = session.get("authToken");

	const lessons = await getLessons(userID, authToken);
	return lessons;
}

interface Lesson {
	id: string;
	attributes: {
		date: string;
	};
}

export default function LessonsPage() {
	const loadedLessons = useLoaderData<typeof loader>();

	return (
		<>
			<h1 className="font-semibold text-2xl mb-3">Lessen</h1>
			<div>
				{loadedLessons.data.map((lesson: Lesson) => (
					<div
						key={lesson.id}
						className="py-3 px-4 rounded-md bg-orange-100 border border-orange-300 border-solid mb-3 flex justify-between align-middle items-center"
					>
						<div>
							<div className="font-bold text-lg">{lesson.attributes.date}</div>
							<div>Standaard in reeks</div>
						</div>
						<Link
							to={"/"}
							className="bg-sky-600 font-bold block py-2 px-3 rounded text-white"
						>
							Les verzetten
						</Link>
					</div>
				))}
			</div>
		</>
	);
}
