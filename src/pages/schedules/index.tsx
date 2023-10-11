import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import Head from "next/head";
import type {
  GameForDisplay,
  ScheduleForDisplay,
} from "~/server/api/routers/schedules";
import CustomSelect from "~/components/selectors/CustomSelect";

const Card = ({ game }: { game: GameForDisplay }) => {
  return (
    <div className="my-6 rounded-[20px] border-2 border-[#283441] bg-[#12171D] p-6">
      <div className="text-l mb-2 font-bold tracking-wider text-slate-400">
        <span className="text-slate-100">{game?.awayTeamLocation} {game?.awayTeamName} {game.status === 'final' ? `(${game.awayTeamScore})` : null}</span>
        <span className="font-normal mx-1">at</span>
        <span className="text-bp-primary">{game?.homeTeamLocation} {game?.homeTeamName} {game.status === 'final' ? `(${game.homeTeamScore})` : null}</span>
      </div>
      <div className="font-bold text-white uppercase">{game.status}</div>
      <div className="text-slate-400">{game.stadium || "Unknown"}</div>
      <div className="flex justify-end"></div>
    </div>
  );
};

const CardContainer = ({ schedule }: { schedule: ScheduleForDisplay }) => {
  if (!schedule?.groupedGames) return null;

  return (
    <div>
      {Object.entries(schedule.groupedGames).map(([day, games]) =>
        games.length > 0 ? (
          <div key={day}>
            <h2 className="text-2xl">{day} {new Date(games[0]?.date ?? "").toLocaleDateString()}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => (
                <Card key={game.id} game={game} />
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};
type ScheduleSelectGroupProps = {
  setYear: (year: string) => void;
  setWeek: (week: string) => void;
  defaultYear: string;
  defaultWeek: string;
};

const ScheduleSelectGroup = ({
  setYear,
  setWeek,
  defaultYear,
  defaultWeek,
}: ScheduleSelectGroupProps) => {
  const { data } = api.competitions.getAllAvailableYearsAndWeeks.useQuery();
  const years = data?.years ?? [];
  const weeks = data?.weeks ?? [];

  const yearOptions = years.map((year) => ({
    value: year.year,
    label: year.year,
  }));

  const weekOptions = weeks.map((week) => ({
    value: week.week,
    label: week.week,
  }));

  const defaultYearOption = {
    value: defaultYear,
    label: defaultYear,
  };

  const defaultWeekOption = {
    value: defaultWeek,
    label: defaultWeek,
  };

  return (
    <div className="flex flex-col sm:flex-row items-start text-5xl gap-4 xl:gap-0">
      <div className="flex max-w-fit items-center mr-8">
        <div className="text-slate-200 mr-4">
          Year: 
        </div>
        <CustomSelect
          options={yearOptions.sort((a, b) => parseInt(b.value) - parseInt(a.value))}
          defaultOption={defaultYearOption}
          onChange={setYear}
          className="box-border bg-[#12171D] border-2 border-[#283441] rounded-2xl px-2 py-2 inline-flex items-center justify-center outline-none"
          optionsClassName="bg-[#12171D] text-slate-200 overflow-hidden"
        />
      </div>

      <div className="flex max-w-fit items-center">
        <div className="text-slate-200 mr-4">
          Week: 
        </div>
        <CustomSelect
          options={weekOptions.sort((a, b) => parseInt(a.value) - parseInt(b.value))}
          defaultOption={defaultWeekOption}
          onChange={setWeek}
          className="box-border bg-[#12171D] border-2 border-[#283441] rounded-2xl px-2 py-2 inline-flex items-center justify-center outline-none"
          optionsClassName="bg-[#12171D] text-slate-200"
        />
      </div>
    </div>
  );
};

export default function SchedulesPage() {
  const currentWeekAndYear = api.schedules.getCurrentWeekAndYear.useQuery().data;

  const [year, setYear] = useState("");
  const [week, setWeek] = useState("");

  const [defaultYear, setDefaultYear] = useState("");
  const [defaultWeek, setDefaultWeek] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const schedule =
    api.schedules.getScheduleForDisplay.useQuery({ year: year, week: week })
      .data ?? ({} as ScheduleForDisplay);

  const handleYearChange = (value: string) => {
    setYear(value);
  };

  const handleWeekChange = (value: string) => {
    setWeek(value);
  };

  useEffect(() => {
    setDefaultYear(currentWeekAndYear?.year.toString() ?? "");
    setDefaultWeek(currentWeekAndYear?.week.toString() ?? "");
  }, [currentWeekAndYear]);

  return (
    <>
      <Head>
        <title>blitzpool - schedules</title>
        <meta
          name="description"
          content="Get access to real-time NFL schedule data."
        />
      </Head>
      <main className="flex min-h-max flex-col text-white md:mt-8 xl:px-32">
        <div className="flex flex-col p-6">
          <div className="flex flex-col lg:flex-row lg:items-start">
            <ScheduleSelectGroup
              setYear={handleYearChange}
              setWeek={handleWeekChange}
              defaultYear={defaultYear}
              defaultWeek={defaultWeek}
            />
          </div>
        </div>

        <div className="p-6">
          <CardContainer schedule={schedule ?? {} as ScheduleForDisplay} />
        </div>
      </main>
    </>
  );
}

SchedulesPage.requireAuth = true;
