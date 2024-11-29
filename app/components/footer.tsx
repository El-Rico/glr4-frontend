import { NavLink } from "@remix-run/react";

export default function Footer() {
  return (
    <footer className="m-auto my-3 flex max-w-3xl items-center justify-between rounded-md border border-gray-300 bg-white px-5 py-5">
      <nav className="flex w-full justify-center gap-x-5">
        <NavLink to="/algemene-voorwaarden">Algemene voorwaarden</NavLink>
        <NavLink to="/veel-gestelde-vragen">Veel gestelde vragen</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
    </footer>
  );
}
