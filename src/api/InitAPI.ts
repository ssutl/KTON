import { Book, Meta_con_highlight } from "./Interface";
import axios, { AxiosResponse } from "axios";
import { useContext } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { useRouter } from "next/router";

function InitAPI() {
  //Grabbing methods to update the applications context
  const { updateBooks, updateUserInfo, updateHighlights } =
    useContext(KTON_CONTEXT);
  const router = useRouter();

  //Making a request to the db in order to grab users highlights
  async function getAllHighlights() {
    //Getting auth from local storage
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

        //Filtering deleted highlights, if there are no highlights return undefined
        //If no highlights push them to the import page
        return response.data.allHighlights.filter(
          (eachHighlight: Meta_con_highlight) =>
            eachHighlight.highlight.deleted === false
        ).length === 0
          ? router.push("/Import")
          : response.data.allHighlights
              .filter(
                (eachHighlight: Meta_con_highlight) =>
                  eachHighlight.highlight.deleted === false
              )
              .sort(function (a: any, b: any) {
                return (
                  new Date(b.highlight.Date).getTime() -
                  new Date(a.highlight.Date).getTime()
                );
              });
      } catch (error) {
        console.error("Error fetching all highlights:", error);
        throw error; // Optionally re-throw the error to handle it in the caller
      }
    }
  }

  //Making a request to the db in order to get all books
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

        //If no books push them to the import page
        return response.data.filter(
          (eachBook: Book) => eachBook.deleted === false
        ).length === 0
          ? router.push("/Import")
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

  //Creating a function which calls all the above APIs in order to populate the App context
  function InitialiseApp() {
    // Fetch data from your database and update the context state variables
    const fetchData = async () => {
      try {
        const [userResponse, booksResponse, highlightsResponse] =
          await Promise.all([getUserInfo(), getAllBooks(), getAllHighlights()]);
        updateUserInfo(userResponse);
        updateBooks(booksResponse);
        updateHighlights(highlightsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userAuthenticated()) {
      fetchData();
    }
  }

  return {
    InitialiseApp,
  };
}

export default InitAPI;
