import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
	Form,
	Link,
	Params,
	useLoaderData,
	useMatches,
} from "@remix-run/react";
import { format, setDefaultOptions } from "date-fns";
import { nl } from "date-fns/locale";
import invariant from "invariant";
import LessonItem from "~/components/lessonItem";
import { Button } from "~/components/ui/button";
import { getAvailableLessons, getLesson } from "~/data.server";
import { getSession } from "~/session";

setDefaultOptions({ locale: nl });

interface Lesson {
	id: string;
	attributes: {
		date: string;
		datename: string;
	};
}

interface UserLessonData {
	id: number;
	// attributes: {
	// 	date: string;
	// 	datename: string;
	// };
}

interface Match {
	id: string;
	pathname: string;
	params: Params<string>;
	data: any;
	handle: any;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
	const session = await getSession(request.headers.get("Cookie"));
	const authToken = session.get("authToken");
	const userID = session.get("userID");

	invariant(params.lessonID, "Expected lessonID");
	const selectedLesson = await getLesson(params.lessonID, authToken);
	const availableLessons = await getAvailableLessons(userID, authToken);

	return { selectedLesson, availableLessons };
}

export default function ChangeLesson() {
	const { selectedLesson, availableLessons } = useLoaderData<typeof loader>();
	const matches = useMatches();
	const userLessons = matches.find((match) => match.id === "routes/lessons");
	const userLessonsData = userLessons?.data;

	invariant(userLessonsData, "User has no lessons");
	let userLessonsIds: number[] = [];
	userLessonsData.data.map((lesson: object) => userLessonsIds.push(lesson.id));

	const filteredLessons = availableLessons.data.filter(
		(lesson: UserLessonData) => !userLessonsIds.includes(lesson.id)
	);

	return (
		<>
			<div className="fixed flex z-10 inset-0 w-screen h-screen bg-black bg-opacity-60 justify-center items-center">
				<div className="z-20 bg-white p-5 max-w-[80%] space-y-3">
					<h2 className="font-bold text-lg">Deze les...</h2>
					<LessonItem
						id={selectedLesson.data.id}
						date={selectedLesson.data.attributes.date}
						showButton={false}
					/>
					<h2 className="font-bold text-lg">verplaatsen naar...</h2>
					<Form className="space-y-2">
						<select className="w-full border border-gray-300 p-3">
							<option value="">Kies een beschikbare les</option>
							{filteredLessons.map((lesson: Lesson) => (
								<option key={lesson.id} value={lesson.id}>
									{format(lesson.attributes.date.toString(), "EEEE")},{" "}
									{format(lesson.attributes.date.toString(), "d MMMM yyyy")}{" "}
									{" / "}
									{format(lesson.attributes.date.toString(), "HH:mm")} uur
								</option>
							))}
						</select>

						<Button className="py-5 bg-sky-600 font-bold w-full text-base">
							Bevestigen
						</Button>
						<Button
							type="submit"
							asChild
							className="font-bold w-full text-base border-gray-900"
							variant="outline"
						>
							<Link to="/lessons">
								<ArrowLeftIcon className="mr-2 h-4 w-4" /> Terug naar lessen
							</Link>
						</Button>
					</Form>
				</div>
			</div>
		</>
	);
}
