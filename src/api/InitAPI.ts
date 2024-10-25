import { Book, Meta_con_highlight } from "./Interface";
import axios, { AxiosResponse } from "axios";
import { useContext } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import { useRouter } from "next/router";
import { demoBooks, demoUserInfo } from "@/helpers/DemoData";

//This function is called on page load and fills the context with the users books and highlights

function InitAPI() {
  //Grabbing methods to update the applications context
  const { updateBooks, updateUserInfo } = useContext(KTON_CONTEXT);
  const router = useRouter();

  //Making a request to the db in order to get all books
  async function getAllBooks() {
    const authToken = localStorage.getItem("token");

    if (authToken === null) throw new Error("No token found");

    try {
      //Awaiting response
      const response = await axios({
        method: `GET`,
        url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books`,
        headers: {
          "x-auth-token": authToken.replace(/\"/g, ""),
        },
      });

      //If no books push them to the import page and return undefined to context
      if (response.data.length === 0) {
        router.push("/Import");
        return undefined;
      }

      //If they have books, but all have deleted tag, we want to push them to the import page but return the books to the context
      if (
        response.data.filter((eachBook: Book) => eachBook.deleted === false)
          .length === 0
      ) {
        router.push("/Import");
      }

      //If they have books, even if all deleted we want to return them to the context
      return response.data
        .map((eachBook: Book) => {
          eachBook.highlights.sort(function (a, b) {
            return new Date(b.Date).getTime() - new Date(a.Date).getTime();
          });
          return eachBook;
        })
        .reverse();
    } catch (error) {
      console.error("Error fetching all books:", error);
      throw error; // Optionally re-throw the error to handle it in the caller
    }
  }

  //Getting User Info
  async function getUserInfo() {
    const authToken = localStorage.getItem("token");

    if (authToken === null) throw new Error("No token found");

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

  //Creating a function which calls all the above APIs in order to populate the App context
  function InitialiseApp() {
    // Fetch data from your database and update the context state variables
    const fetchData = async () => {
      try {
        const [userResponse, booksResponse] = await Promise.all([
          getUserInfo(),
          getAllBooks(),
        ]);
        updateUserInfo(userResponse);
        updateBooks(booksResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const Demo = localStorage.getItem("Demo") === "true";
    const authToken = localStorage.getItem("token");

    if (authToken) {
      fetchData();
    } else if (Demo) {
      updateUserInfo(demoUserInfo);
      updateBooks(demoBooks);
    }
  }

  return {
    InitialiseApp,
  };
}

export default InitAPI;
