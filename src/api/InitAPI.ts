import { Book, Meta_con_highlight } from "./Interface";
import axios, { AxiosResponse } from "axios";
import { useContext } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import { useRouter } from "next/router";

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

      //Filtering deleted books

      //If no books push them to the import page
      return response.data.filter(
        (eachBook: Book) => eachBook.deleted === false
      ).length === 0 || response.data.length === 0
        ? router.push("/Import")
        : response.data
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
    console.log("called");
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

    fetchData();
  }

  return {
    InitialiseApp,
  };
}

export default InitAPI;
