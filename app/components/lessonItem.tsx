import { Link } from "@remix-run/react";
import { format, setDefaultOptions } from "date-fns";
import { nl } from "date-fns/locale";
import { Button } from "./ui/button";
import { LockClosedIcon } from "@radix-ui/react-icons";

setDefaultOptions({ locale: nl });

interface LessonItemProps {
  id: string;
  date: string;
  showButton: boolean;
}

export default function LessonItem({ id, date, showButton }: LessonItemProps) {
  const lessonDate = new Date(date);
  const currentDate = new Date();
  const rescheduleDeadline = 8;
  const canReschedule =
    (lessonDate.getTime() - currentDate.getTime()) / 1000 / 60 / 60 >
    rescheduleDeadline;

  return (
    <div
      key={id}
      className="mb-1 flex items-center justify-between rounded-md border border-solid border-gray-300 bg-white p-3 pr-4 align-middle"
    >
      <div className="flex items-baseline gap-4">
        <div className="box-border w-[60px] rounded bg-zinc-700 p-2 text-center text-2xl font-semibold uppercase text-white">
          {format(date, "EEEEEE")}
        </div>
        <div className="text-lg font-bold">
          {format(date, "d MMMM yyyy")} <span className="font-normal">/</span>{" "}
          {format(date, "HH:mm")} uur
        </div>
      </div>
      {showButton && canReschedule && (
        <Button
          asChild
          className="text-md block rounded bg-sky-600 px-3 py-2 font-bold text-white hover:bg-gray-700"
        >
          <Link to={`reschedule/${id}`}>Les verzetten</Link>
        </Button>
      )}
      {showButton && !canReschedule && (
        <Button
          disabled
          className="text-md block flex space-x-2 rounded bg-gray-900 px-3 py-2 text-white hover:bg-gray-700"
        >
          <LockClosedIcon /> <span>Les verzetten</span>
        </Button>
      )}
    </div>
  );
}
