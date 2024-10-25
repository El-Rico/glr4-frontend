import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "GL Reservations" },
    { name: "description", content: "Reserveer en plan je lessen hier" },
  ];
};

export default function Index() {
  return (
    <>
      <h1 className="text-2xl font-medium">
        Reserveringsysteem cursus Pasteltekenen
      </h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elementum,
        lacus sed efficitur sagittis, libero mauris tempor felis, at efficitur
        magna libero ac urna.
      </p>
      <p>
        Nam ultrices placerat pretium. Proin finibus nisl dolor, eu venenatis
        neque lacinia et. Sed placerat elementum purus vel luctus. Quisque risus
        est, fermentum sit amet consectetur vitae, luctus blandit nulla. Duis
        molestie mauris ac sem porta tincidunt. Mauris magna arcu, ullamcorper
        sed dui quis, pretium rhoncus ligula.
      </p>
    </>
  );
}
