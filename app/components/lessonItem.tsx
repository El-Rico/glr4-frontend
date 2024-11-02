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
  cancelled: boolean;
}

export default function LessonItem({
  id,
  date,
  showButton,
  cancelled,
}: LessonItemProps) {
  const lessonDate = new Date(date);
  const currentDate = new Date();
  const rescheduleDeadline = 8;
  const canReschedule =
    (lessonDate.getTime() - currentDate.getTime()) / 1000 / 60 / 60 >
    rescheduleDeadline;

  return (
    <div
      key={id}
      className="space-between mb-1 flex items-center justify-between rounded-md border border-solid border-gray-300 bg-white p-3 pr-4"
    >
      <div className="flex items-center gap-4">
        <div className="box-border w-[60px] rounded bg-zinc-700 p-2 text-center text-2xl font-semibold uppercase text-white">
          {format(date, "EEEEEE")}
        </div>
        <div className="text-lg">
          <div className="flex justify-center gap-2 font-bold">
            {format(date, "dd MMM yyyy")}{" "}
            {cancelled && (
              <span className="rounded-xl bg-red-600 px-3 pb-[3px] pt-[4px] text-center text-sm font-semibold text-white">
                Gaat niet door
              </span>
            )}
          </div>
          <div>{format(date, "HH:mm")} uur</div>
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
