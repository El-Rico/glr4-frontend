import { NavLink } from "@remix-run/react";

interface HeaderProps {
	isAuthenticated: boolean;
}

export default function Header({ isAuthenticated }: HeaderProps) {
	return (
		<header className="bg-white py-5 px-5 border mb-5 my-2 border-gray-300 flex justify-between items-center rounded-md">
			<div className="font-bold uppercase text-2xl">
				GL<span className="font-thin">Reservations</span>
			</div>

			<nav className="space-x-2">
				<NavLink to={"/"}>Home</NavLink>
				{isAuthenticated ? <NavLink to={"/lessons"}>Lessen</NavLink> : ""}
				{isAuthenticated ? <NavLink to={"/logout"}>Log uit</NavLink> : ""}
				{!isAuthenticated ? <NavLink to={"/login"}>Log in</NavLink> : ""}
			</nav>
		</header>
	);
}
