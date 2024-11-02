import { NavLink } from "@remix-run/react";

interface HeaderProps {
  isAuthenticated: boolean;
}

export default function Header({ isAuthenticated }: HeaderProps) {
  return (
    <header className="m-auto my-3 flex max-w-3xl items-center justify-between rounded-md border border-gray-300 bg-white px-5 py-5">
      <div className="text-2xl font-bold uppercase">
        GL<span className="font-thin"> Lesportaal</span>
      </div>

      <nav className="space-x-2">
        <NavLink to={"/"}>Home</NavLink>
        {isAuthenticated ? <NavLink to={"/lessons"}>Lessen</NavLink> : ""}
        {isAuthenticated ? (
          <NavLink to={"/logout"}>Log uit</NavLink>
        ) : (
          <NavLink to={"/login"}>Log in</NavLink>
        )}
      </nav>
    </header>
  );
}
