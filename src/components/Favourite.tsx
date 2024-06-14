import { RefObject } from "react";

type FavouriteProps = {
  favouriteCities: { id: string; city: string }[];
  searchRef: RefObject<HTMLInputElement>;
  onSearchFavourite: () => void;
};

export default function Favourite({
  favouriteCities,
  searchRef,
  onSearchFavourite,
}: FavouriteProps) {
  const onClickFavourite = (city: string) => {
    if (searchRef.current) {
      searchRef.current.value = city;
    }
    onSearchFavourite();
  };

  return (
    <div className="bg-teal-200 p-5 rounded-lg h-min w-80 space-y-4">
      <h1 className="text-center text-xl font-semibold text-green-900">
        Favourite Cities
      </h1>
      <ul className="flex flex-col items-center">
        {favouriteCities?.map((city: { id: string | number; city: string }) => (
          <li key={city.id} onClick={onClickFavourite.bind(null, city.city)}>
            <h3 className="text-lg font-medium tracking-wide cursor-pointer">
              {city.city}
            </h3>
          </li>
        ))}
      </ul>
    </div>
  );
}
