import React, { useState, useEffect, useContext } from "react";
import {
  Book,
  Book_highlight,
  Meta_con_highlight,
  userInfo,
} from "./Interface";
import axios, { AxiosResponse } from "axios";

function InitAPI() {
  async function getAllHighlights() {
    const authToken = localStorage.getItem("token");

    if (authToken === null) {
      return undefined;
    } else {
      try {
        const response = await axios({
          method: `GET`,
          url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books/all-highlights`,
          headers: {
            "x-auth-token": authToken.replace(/\"/g, ""),
          },
        });

        if (Array.isArray(response.data.allHighlights)) {
          return response.data.allHighlights.filter(
            (eachHighlight: Meta_con_highlight) =>
              eachHighlight.highlight.deleted === false
          ).length === 0
            ? []
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

  async function getAllBooks() {
    const authToken = localStorage.getItem("token");

    if (authToken === null) {
      return undefined;
    } else {
      try {
        const response = await axios({
          method: `GET`,
          url: `${process.env.NEXT_PUBLIC_BACKENDURL}/books`,
          headers: {
            "x-auth-token": authToken.replace(/\"/g, ""),
          },
        });

        return response.data.filter(
          (eachBook: Book) => eachBook.deleted === false
        ).length === 0
          ? []
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

  async function getUserInfo() {
    const authToken = localStorage.getItem("token");

    if (authToken === null) {
      return undefined;
    } else {
      try {
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

  // Rest of the code remains the same

  return {
    getAllBooks,
    getAllHighlights,
    getUserInfo,
  };
}

export default InitAPI;
