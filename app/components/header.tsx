import { NavLink } from "@remix-run/react";

interface HeaderProps {
	isAuthenticated: boolean;
}

export default function Header({ isAuthenticated }: HeaderProps) {
	return (
		<header className="py-5 border-b mb-5 border-orange-200 flex justify-between">
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
