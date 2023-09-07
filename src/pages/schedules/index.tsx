import { useState, useEffect, useCallback } from "react";
import { api } from "../../utils/api";
import Head from "next/head";
import type { Game } from "~/server/api/routers/schedules";

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
  function parseTeams(inputString: string): { homeTeam: string; awayTeam: string; } | null {
    const teams = inputString.split(" at ");
  
    // Ensure there are two parts (home team and away team)
    if (teams.length === 2) {
      const homeTeam = teams[1]; // The team after "at" is the home team
      const awayTeam = teams[0]; // The team before "at" is the away team

      if (!homeTeam || !awayTeam) {
        return null;
      }

      return { homeTeam, awayTeam };
    } else {
      // Handle invalid input format
      return null;
    }
  }

  const teamsData = parseTeams(game.name);

  return (
    <div className="my-6 rounded-[20px] border-2 border-[#283441] bg-[#12171D] p-6">
      <div className="text-l mb-2 font-bold text-slate-300">
        <span className="text-slate-100">{teamsData?.awayTeam}</span> at <span className="text-bp-primary">{teamsData?.homeTeam}</span>
      </div>
      <div className="text-white font-bold">
        {game.status.type.shortDetail}
      </div>
      <div className="text-slate-400">
        {game.competitions[0]?.venue.fullName}
      </div>
      <div className="flex justify-end"></div>
    </div>
  );
};

const CardContainer = ({ games }: { games: Game[] }) => {
  const groupGamesByDay = () => {
    if (games.length === 0) return {} as GroupedGames;

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
    <div>
      {Object.entries(groupedGames).map(([day, games]) => (
        <div key={day}>
          <h2 className="text-2xl">{day}</h2>
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

export default function SchedulesPage() {
  const [year, setYear] = useState("2023");
  const [week, setWeek] = useState("1");
  const [games, setGames] = useState<Game[]>([]);

  const defaultSearch = { year: "2023", week: "1" };
  const { data: initialScheduleData } =
    api.schedules.getData.useQuery(defaultSearch);
  const { data: queriedScheduleData } = api.schedules.getData.useQuery({
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
      <main className="flex min-h-max flex-col text-white md:mt-8">
        <div className="flex flex-col p-6">
          <div className="flex flex-col items-center lg:flex-row lg:items-start">
            <div className="flex max-w-fit flex-col">
              <label className="text-2xl uppercase">Year</label>
              <input
                type="number"
                value={year}
                className="rounded-md border bg-transparent p-2 mt-2 text-2xl text-slate-400 focus:border-slate-400 focus:outline-none"
                onChange={handleYearChange}
              />
            </div>

            <div className="my-6 flex max-w-fit flex-col lg:mx-6 lg:my-0">
              <label className="text-2xl uppercase">Week</label>

              <input
                type="number"
                value={week}
                className="rounded-md border bg-transparent p-2 mt-2 text-2xl text-slate-400 focus:border-slate-400 focus:outline-none"
                onChange={handleWeekChange}
              />
            </div>

            <button
              onClick={handleFetchClick}
              className="mt-8 max-w-fit rounded-full border-none bg-[#283441] px-16 py-4 text-2xl font-light text-white transition hover:bg-white/20"
            >
              Fetch Schedules
            </button>
          </div>
        </div>

        <div className="p-6">
          <CardContainer games={games} />
        </div>
      </main>
    </>
  );
}

SchedulesPage.requireAuth = true;
