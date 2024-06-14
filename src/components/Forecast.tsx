/* eslint-disable @typescript-eslint/no-explicit-any */
type ForecastProps = {
  data: any[];
};

export default function Forecast({ data }: ForecastProps) {
  return (
    <>
      <h1 className="text-orange-200 text-3xl pt-10">5-Day Forecast</h1>
      <ul className="flex flex-col md:flex-row items-center gap-10 pt-5">
        {data?.slice(1).map((forecast: any) => (
          <li key={forecast?.dt_txt}>
            <h1 className="text-slate-900 font-semibold text-xl">
              {forecast?.dt_txt.split(" ")[0]}
            </h1>
            <strong className="tracking-wider text-xl text-rose-800">
              {forecast?.main.temp} °c
            </strong>
          </li>
        ))}
      </ul>
    </>
  );
}
