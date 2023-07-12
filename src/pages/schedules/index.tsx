import { useState, useEffect, useCallback } from "react";
import { NextPage } from "next";
import { api } from "../../utils/api";
import { Game } from "~/server/api/routers/schedules";
import Head from "next/head";

type GroupedGames = {
  [key: string]: Game[];
};

function getDayOfWeekName(dayOfWeek: number) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[dayOfWeek];
}

const Card = ({ game }: { game: Game }) => {
  return (
    <div className="rounded-lg bg-secondary-dark p-4 text-black shadow-lg">
      <h3 className="text-l mb-2 font-bold text-white">{game.name}</h3>
      {/* Add more data fields here */}
      <div className="flex justify-end"></div>
    </div>
  );
};

const CardContainer = ({ games }: { games: Game[] }) => {
  const groupGamesByDay = () => {
    const groupedGames: GroupedGames = {
      Thursday: [],
      Sunday: [],
      Monday: [],
    };

    games.forEach((game) => {
      const numericDayOfWeek = new Date(game.date).getDay();
      const dayOfWeekName = getDayOfWeekName(numericDayOfWeek);

      if (dayOfWeekName && dayOfWeekName in groupedGames) {
        groupedGames[dayOfWeekName]?.push(game);
      }
    });

    return groupedGames;
  };

  const groupedGames = groupGamesByDay();

  return (
    <div className="grid grid-cols-1 gap-8">
      {Object.entries(groupedGames).map(([day, games]) => (
        <div key={day}>
          <h2 className="text-2xl font-semibold">{day}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {games.map((game) => (
              <Card key={game.uid} game={game} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const SchedulesPage: NextPage = () => {
  const [year, setYear] = useState("2023");
  const [week, setWeek] = useState("1");
  const [games, setGames] = useState<Game[]>([]);
  const { data: initialScheduleData } = api.schedules.getData.useQuery({
    year: '2023',
    week: '1',
  });
  const { data: queriedScheduleData }= api.schedules.getData.useQuery({
    year,
    week,
  });

  useEffect(() => {
    if (initialScheduleData) setGames(initialScheduleData);
  }, [initialScheduleData]);

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYear(event.target.value);
  };

  const handleWeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeek(event.target.value);
  };

  const handleFetchClick = useCallback(() => {
    if (queriedScheduleData) setGames(queriedScheduleData);
  }, [queriedScheduleData]);

  return (
    <>
      <Head>
        <title>blitzpool - schedules</title>
        <meta
          name="description"
          content="Get access to real-time NFL schedule data."
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center text-white">
        <div className="flex">
          <label className="px-4 uppercase font-bold">
            Year
            <input
              type="number"
              value={year}
              className="rounded-md border bg-transparent ml-2 px-2 py-1 text-slate-400 focus:border-slate-400 focus:outline-none"
              onChange={handleYearChange}
            />
          </label>
          <label className="px-4 uppercase font-bold">
            Week:
            <input
              type="number"
              value={week}
              className="rounded-md border bg-transparent ml-2 px-2 py-1 text-slate-400 focus:border-slate-400 focus:outline-none"
              onChange={handleWeekChange}
            />
          </label>
          <button
            onClick={handleFetchClick}
            className="rounded-full bg-white/10 px-4 py-2 text-white transition hover:bg-white/20"
          >
            Fetch Schedules
          </button>
        </div>

        <div className="container mx-auto my-8">
          <CardContainer games={games} />
        </div>
      </main>
    </>
  );
};

export default SchedulesPage;
