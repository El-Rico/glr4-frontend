import { Link } from "@remix-run/react";

export default function LessonsPage() {
	return (
		<>
			<h1 className="font-semibold text-2xl mb-3">Lessen</h1>
			<div>
				<div className="py-3 px-4 rounded-md bg-orange-100 border border-orange-300 border-solid mb-3 flex justify-between align-middle items-center">
					<div>
						<div className="font-bold text-lg">Maandag, 13 januari 2025</div>
						<div>Standaard in reeks</div>
					</div>
					<Link
						to={"/"}
						className="bg-sky-600 font-bold block py-2 px-3 rounded text-white"
					>
						Les verzetten
					</Link>
				</div>
			</div>
		</>
	);
}
