import {
  Book,
  Book_highlight,
  Meta_con_highlight,
  userInfo,
} from "./Interface";
import axios, { AxiosResponse } from "axios";

function InitAPI() {
  //Here holds the API which will be called when an authenticated user logs in
  //This information will then be passed to the context so the entire app can have it

  //Grabbing highlights
  async function getAllHighlights() {
    const authToken = localStorage.getItem("token");

    if (authToken === null) {
      return undefined;
    } else {
      try {
        //Awaiting response
        const response = await axios({
          method: `GET`,
          url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/all-highlights`,
          headers: {
            "x-auth-token": authToken.replace(/\"/g, ""),
          },
        });

        //Filtering deleted highlights
        if (Array.isArray(response.data.allHighlights)) {
          return response.data.allHighlights.filter(
            (eachHighlight: Meta_con_highlight) =>
              eachHighlight.highlight.deleted === false
          ).length === 0
            ? undefined
            : response.data.allHighlights
                .filter(
                  (eachHighlight: {
                    author: string;
                    highlight: Book_highlight;
                    title: string;
                  }) => eachHighlight.highlight.deleted === false
                )
                .sort(function (a: any, b: any) {
                  return (
                    new Date(b.highlight.Date).getTime() -
                    new Date(a.highlight.Date).getTime()
                  );
                });
        }
      } catch (error) {
        console.error("Error fetching all highlights:", error);
        throw error; // Optionally re-throw the error to handle it in the caller
      }
    }
  }

  //Getting all books
  async function getAllBooks() {
    const authToken = localStorage.getItem("token");

    if (authToken === null) {
      return undefined;
    } else {
      try {
        //Awaiting response
        const response = await axios({
          method: `GET`,
          url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books`,
          headers: {
            "x-auth-token": authToken.replace(/\"/g, ""),
          },
        });

        //Filtering deleted books
        return response.data.filter(
          (eachBook: Book) => eachBook.deleted === false
        ).length === 0
          ? undefined
          : response.data
              .map((eachBook: Book) => {
                eachBook.highlights.sort(function (a, b) {
                  return (
                    new Date(b.Date).getTime() - new Date(a.Date).getTime()
                  );
                });

                return eachBook;
              })
              .reverse()
              .filter((eachBook: Book) => eachBook.deleted === false);
      } catch (error) {
        console.error("Error fetching all books:", error);
        throw error; // Optionally re-throw the error to handle it in the caller
      }
    }
  }

  //Getting User Info
  async function getUserInfo() {
    const authToken = localStorage.getItem("token");

    if (authToken === null) {
      return undefined;
    } else {
      try {
        //Awaiting response
        const response = await axios({
          method: `GET`,
          url: `${process.env.NEXT_PUBLIC_BACKENDURL}/users/info`,
          headers: {
            "x-auth-token": authToken.replace(/\"/g, ""),
          },
        });

        return response.data;
      } catch (error) {
        console.error("Error fetching user info:", error);
        throw error; // Optionally re-throw the error to handle it in the caller
      }
    }
  }

  return {
    getAllBooks,
    getAllHighlights,
    getUserInfo,
  };
}

export default InitAPI;
