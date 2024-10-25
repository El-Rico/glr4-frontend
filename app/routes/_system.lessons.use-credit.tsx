import { ArrowLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useMatches,
  useNavigation,
} from "@remix-run/react";
import { format, setDefaultOptions } from "date-fns";
import { nl } from "date-fns/locale";
import invariant from "invariant";
import CreditItem from "~/components/creditItem";
import { Button } from "~/components/ui/button";
import { buyLesson, getAvailableLessons } from "~/data.server";
import { commitSession, getSession } from "~/session";

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
  attributes: {
    capacity: number;
    users_permissions_users: {
      data: {
        attributes: {
          count: number;
        };
      };
    };
  };
}

interface UserLessonsData {
  userLessons: {
    data: object[];
  };
}

interface FormData {
  currentCredit: string;
  newLesson: string;
}

export async function action({ request }: ActionFunctionArgs) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const session = await getSession(request.headers.get("Cookie"));
  const authToken = session.get("authToken");
  const userID: string = session.get("userID");

  const formData = await request.formData();
  const data: FormData = Object.fromEntries(formData);

  const response = await buyLesson(
    parseInt(data.currentCredit),
    parseInt(data.newLesson),
    authToken,
    userID,
  );

  if (!response) {
    throw new Response("Oh no! Something went wrong in the action function!", {
      status: 500,
    });
  }

  // return redirect("/lessons");
  session.set("credit", parseInt(data.currentCredit) - 1);

  return redirect("/lessons", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const authToken = session.get("authToken");
  const credit = session.get("credit");

  const availableLessons = await getAvailableLessons(authToken);

  return { availableLessons, credit };
}

export default function BuyLesson() {
  const { availableLessons, credit } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const matches = useMatches();
  const userLessons = matches.find(
    (match) => match.id === "routes/_system.lessons",
  );
  invariant(userLessons, "No user lessons.");
  const userLessonsData: UserLessonsData = userLessons.data?.loadedLessons.data;

  invariant(userLessonsData, "User has no lessons");
  let userLessonsIds: number[] = [];
  userLessonsData.map((lesson: object) => userLessonsIds.push(lesson.id));

  const filteredLessonsUser = availableLessons.data.filter(
    // Filter out current users lessons
    (lesson: UserLessonData) => !userLessonsIds.includes(lesson.id),
  );

  const filteredLessons = filteredLessonsUser.filter(
    // Filter out full lessons
    (lesson: UserLessonData) =>
      lesson.attributes.users_permissions_users.data.attributes.count !==
      lesson.attributes.capacity,
  );

  return (
    <>
      <div className="fixed inset-0 z-10 flex h-screen w-screen items-center justify-center bg-black bg-opacity-60">
        <div className="z-20 max-w-[80%] space-y-3 bg-white p-5">
          <CreditItem credit={credit} />
          <h2 className="text-lg font-bold">Kies een les voor 1 credit:</h2>
          <Form className="space-y-2" method="post">
            <input type="hidden" name="currentCredit" value={credit} />
            <select
              name="newLesson"
              className="w-full border border-gray-300 p-3"
              required
            >
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

            {navigation.state === "idle" ? (
              <Button
                type="submit"
                className="w-full bg-sky-600 py-5 text-base font-bold"
              >
                Bevestigen
              </Button>
            ) : (
              <Button disabled className="w-full py-5 text-base">
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Even wachten...
              </Button>
            )}

            <Button
              type="button"
              asChild
              className="w-full border-gray-900 text-base font-bold"
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
