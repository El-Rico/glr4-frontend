import { Link } from "@remix-run/react";
import { format, setDefaultOptions } from "date-fns";
import { nl } from "date-fns/locale";

setDefaultOptions({ locale: nl });

interface LessonItemProps {
	id: string;
	date: string;
}

export default function LessonItem({ id, date }: LessonItemProps) {
	return (
		<div
			key={id}
			className="p-3 rounded-md bg-white border border-gray-300 border-solid mb-1 flex justify-between align-middle items-center"
		>
			<div className="flex items-baseline gap-4">
				<div className="text-2xl uppercase font-semibold w-[60px] rounded bg-zinc-700 text-white text-center p-2 box-border">
					{format(date, "EEEEEE")}
				</div>
				<div className="text-lg font-bold">
					{format(date, "d MMMM yyyy")} <span className="font-normal">/</span>{" "}
					{format(date, "HH:mm")} uur
				</div>
			</div>
			<Link
				to={"/"}
				className="bg-sky-600 hover:bg-gray-700 font-bold block py-2 px-3 rounded text-white"
			>
				Les verzetten
			</Link>
		</div>
	);
}
