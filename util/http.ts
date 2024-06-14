import toast from "react-hot-toast";

const URL = "http://localhost:8000/favouriteCities";

export const getFavouriteCities = async () => {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const addFavouriteCity = async (favouriteCity: {
  id: string;
  city: string;
}) => {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(favouriteCity),
    });

    if (response?.ok) {
      toast.success("Successfully added to Favourites");
    }
  } catch (error) {
    console.error(error);
  }
};

export const removeFavouriteCity = async (id: string) => {
  try {
    const response = await fetch(`${URL}/${id}`, { method: "DELETE" });
    if (response?.ok) {
      toast.success("Successfully removed from Favourites");
    }
  } catch (error) {
    console.error(error);
  }
};
