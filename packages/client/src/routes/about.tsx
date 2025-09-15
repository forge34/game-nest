import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6 py-5 px-11">
      <h1 className="font-bold text-2xl mb-1">About GridCollect</h1>
      <div className="flex flex-col max-w-[65%]">
        <h3 className="text-lg font-semibold">What is GridCollect</h3>
        <p className="text-muted-foreground text-wrap">
          GridCollect is a game collection website where you can browse games ,
          build a library of games or create collections of games and share them
          with others
        </p>
      </div>

      <div className="flex flex-col max-w-[65%]">
        <h3 className="text-lg font-semibold">Why i built it</h3>

        <p className="text-muted-foreground">
          I built GridCollect as a personal project to practice full-stack web
          development. It lets me organize my digital games, create collections,
          and experiment with building real features in a web app.
        </p>
      </div>

      <div className="flex flex-col max-w-[65%] mt-4">
        <h3 className="text-lg font-semibold">Key Features</h3>
        <ul className="list-disc ml-5 gap-2 text-muted-foreground">
          <li>Browse through a collection of games</li>
          <li>Create and manage your game collections</li>
          <li>Build a personal library</li>
          <li>Rate and organize games</li>
        </ul>
      </div>
      <div className="flex flex-col max-w-[65%] mt-4">
        <h3 className="text-lg font-semibold">How It Works</h3>
        <p className="text-muted-foreground text-wrap">
          Simply create an account, browse the game library, and start adding
          games to your collections. You can rate games, organize them into
          custom collections, and share your lists with everyone
        </p>
      </div>
      <div className="flex flex-col max-w-[65%] mt-4">
        <h3 className="text-lg font-semibold">Coming Soon</h3>
        <p className="text-muted-foreground text-wrap">
          i will be working on some features in the future! Upcoming features
          include recommendations based on your library, steam linking, social
          features, and more.
        </p>
      </div>
      <div className="flex flex-col max-w-[65%] mt-4">
        <h3 className="text-lg font-semibold">Try it out!</h3>
        <p className="text-muted-foreground text-wrap">
          You can start using the website by visiting the discover page or
          signing up and creating a collection{" "}
        </p>
      </div>
    </div>
  );
}
