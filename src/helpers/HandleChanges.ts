import React, { useState, useEffect, useContext } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import rateBookApi from "@/api/Books/RateBook";
import addGenreToBookApi from "@/api/Books/AddGenreToBook";
import { colorMapKeys } from "./sortGenreColors";
import addGenreToUserApi from "@/api/Users/AddGenre";
import favouriteHighlightApi from "@/api/Highlights/Favourite";
import addHighlightCategoryApi from "@/api/Highlights/AddCategories";
import addUserCategoryApi from "@/api/Users/AddCategories";
import summariseBookApi from "@/api/Books/Summary";
import annotateHighlightApi from "@/api/Highlights/Annotate";
import changeBookImageApi from "@/api/Books/ChangeBookImage";
import markAsAnnotatedApi from "@/api/Books/MarkAsAnnotated";
import deleteBookApi from "@/api/Books/DeleteBook";
import deleteHighlightApi from "@/api/Highlights/Delete";

export interface RatingProps {
  data: number;
  book_id: string;
}

export interface GenreProps {
  data: string;
  book_id: string | undefined | string[];
  type: "add" | "remove";
  color?: colorMapKeys;
}
export interface favouriteHighlightProps {
  data: boolean;
  book_id: string | undefined | string[];
  highlight_id: string;
}

export interface annotateHighlightProps {
  data: string;
  book_id: string | undefined | string[];
  highlight_id: string;
}

export interface deleteHighlightProps {
  book_id: string;
  highlight_id: string;
}

export interface addCategoryToHighlightProps {
  type: "add" | "remove";
  data: string;
  book_id: string | undefined | string[];
  highlight_id: string | string[];
}

export interface addSummaryToBookProps {
  data: string | undefined;
  book_id: string | undefined | string[];
}

export interface markBookAsAnnotatedProps {
  book_id: string;
}

export interface updateBookCoverProps {
  data: string | undefined;
  book_id: string | undefined | string[];
}

function HandleChanges() {
  const { updateBooks, books, userinfo, updateUserInfo } =
    useContext(KTON_CONTEXT);

  const addRating = ({ data, book_id }: RatingProps) => {
    //Checking if user is in demo mode
    const Demo = localStorage.getItem("Demo") === "true";
    const token = localStorage.getItem("token");

    if (books) {
      const newState = books.map((book_context) => {
        //If book has same ID change rating locally
        if (book_id === book_context._id) {
          return { ...book_context, rating: data };
        } else return book_context;
      });

      //Handling request locally
      updateBooks(newState);

      //Handling request on server only if not in demo mode
      if (Demo && !token) return;
      rateBookApi({ book_id: book_id, data: data });
    }
  };

  const addGenreToBook = ({ data, book_id, type }: GenreProps) => {
    //Checking if user is in demo mode
    const Demo = localStorage.getItem("Demo") === "true";
    const token = localStorage.getItem("token");

    if (books && book_id) {
      // Create an array containing the book ids, even if 'book_id' is a single string
      const bookIds = Array.isArray(book_id) ? book_id : [book_id];

      const newState = books.map((book_context) => {
        if (bookIds.includes(book_context._id)) {
          return {
            ...book_context,
            genre:
              type === "add"
                ? [...book_context.genre, data]
                : book_context.genre.filter((eachGenre) => eachGenre !== data),
          };
        } else {
          return book_context;
        }
      });

      //Handling request locally
      updateBooks(newState);

      //Handling request on server only if not in demo mode
      if (Demo && !token) return;

      bookIds.forEach((id) => {
        // Sorting on server for each book using the API
        addGenreToBookApi({
          book_id: id,
          data: newState.filter((book) => book._id === id)[0].genre, // Pass the genre data for the current book to the API
        });
      });
    }
  };

  const addGenreToUser = ({ data, book_id, type, color }: GenreProps) => {
    //Checking if user is in demo mode
    const Demo = localStorage.getItem("Demo") === "true";
    const token = localStorage.getItem("token");

    if (userinfo) {
      let newState = userinfo;
      let book = books?.filter((book) => book._id === book_id)[0];

      if (type === "add" && color) {
        //Add the genre to the userinfo genres
        newState = {
          ...userinfo,
          genres: { ...userinfo.genres, [data]: color },
        };
      } else if (type === "remove") {
        //Filter the userinfo genres to remove the genre and add to newState
        let ghost = userinfo.genres;
        delete ghost[data];
        newState = { ...userinfo, genres: ghost };
      }

      //sorting locally
      updateUserInfo(newState);

      //Handling request on server only if not in demo mode
      if (Demo && !token) return;

      addGenreToUserApi({ data: newState.genres });

      //Adding it to the book that it was created from
      if (book && type === "add" && !book.genre.includes(data)) {
        addGenreToBook({ type, data, book_id });
      }

      //Removing it from all books

      if (books && type === "remove") {
        //When we run this in a loop, it is getting the old state of books and mapping through that, so we need to allow it to update the state before we run it again

        //I want an array of ids of books that have the genre that we are removing
        const arrayOfIds = books.reduce((acc, book) => {
          if (book.genre.includes(data)) {
            acc.push(book._id);
          }
          return acc;
        }, [] as string[]);

        addGenreToBook({ type, data, book_id: arrayOfIds });
      }
    }
  };

  const favouriteHighlight = ({
    data,
    book_id,
    highlight_id,
  }: favouriteHighlightProps) => {
    //Checking if user is in demo mode
    const Demo = localStorage.getItem("Demo") === "true";
    const token = localStorage.getItem("token");

    if (books && typeof book_id === "string") {
      //Handling request locally
      const newState = books.map((book_context) => {
        if (book_id === book_context._id) {
          return {
            ...book_context,
            highlights: book_context.highlights.map((highlight) => {
              if (highlight._id === highlight_id) {
                return { ...highlight, starred: data };
              } else return highlight;
            }),
          };
        } else return book_context;
      });

      //Handling request locally
      updateBooks(newState);

      //Handling request on server only if not in demo mode
      if (Demo && !token) return;

      favouriteHighlightApi({
        book_id,
        highlight_id: highlight_id,
        data: data,
      });
    }
  };

  const deleteHighlight = ({ book_id, highlight_id }: deleteHighlightProps) => {
    //Checking if user is in demo mode
    const Demo = localStorage.getItem("Demo") === "true";
    const token = localStorage.getItem("token");

    if (books) {
      const value = !books
        .filter((book) => book._id === book_id)[0]
        .highlights.filter((highlight) => highlight._id === highlight_id)[0]
        .deleted;

      const newState = books.map((book_context) => {
        if (book_id === book_context._id) {
          return {
            ...book_context,
            highlights: book_context.highlights.map((highlight) => {
              if (highlight._id === highlight_id) {
                return { ...highlight, deleted: value };
              } else return highlight;
            }),
          };
        } else return book_context;
      });

      //Handling request locally
      updateBooks(newState);

      //Handling request on server only if not in demo mode
      if (Demo && !token) return;

      deleteHighlightApi({ book_id, highlight_id, data: value });
    }
  };

  const annotateHighlight = ({
    data,
    book_id,
    highlight_id,
  }: annotateHighlightProps) => {
    //Checking if user is in demo mode
    const Demo = localStorage.getItem("Demo") === "true";
    const token = localStorage.getItem("token");

    if (books && typeof book_id === "string") {
      const newState = books.map((book_context) => {
        if (book_id === book_context._id) {
          return {
            ...book_context,
            highlights: book_context.highlights.map((highlight) => {
              if (highlight._id === highlight_id) {
                return { ...highlight, notes: data };
              } else return highlight;
            }),
          };
        } else return book_context;
      });

      //Handling request locally
      updateBooks(newState);

      //Handling request on server only if not in demo mode
      if (Demo && !token) return;

      annotateHighlightApi({
        book_id,
        highlight_id: highlight_id,
        data: data,
      });
    }
  };

  const addCategoryToHighlight = ({
    data,
    type,
    book_id,
    highlight_id,
  }: addCategoryToHighlightProps) => {
    //Checking if user is in demo mode
    const Demo = localStorage.getItem("Demo") === "true";
    const token = localStorage.getItem("token");

    if (books && book_id) {
      const bookIds = Array.isArray(book_id) ? book_id : [book_id];
      const highlightIds = Array.isArray(highlight_id)
        ? highlight_id
        : [highlight_id];

      const newState = books.map((book_context) => {
        //gonna map through the books and select the book that id is included in the array of book ids
        if (bookIds.includes(book_context._id)) {
          return {
            ...book_context,
            //gonna map through the highlights and select the highlight that id is included in the array of highlight ids
            highlights: book_context.highlights.map((highlight) => {
              if (highlightIds.includes(highlight._id)) {
                return {
                  ...highlight,
                  category:
                    type === "add"
                      ? [...highlight.category, data]
                      : highlight.category.filter(
                          (eachCategory) => eachCategory !== data
                        ),
                };
              } else return highlight;
            }),
          };
        } else return book_context;
      });

      //Handling request locally
      updateBooks(newState);

      //Handling request on server only if not in demo mode
      if (Demo && !token) return;

      books.map((book) => {
        if (bookIds.includes(book._id)) {
          book.highlights.map((highlight) => {
            if (highlightIds.includes(highlight._id)) {
              addHighlightCategoryApi({
                book_id: book._id,
                highlight_id: highlight._id,
                data: newState
                  .filter(
                    (bookFromNewState) => bookFromNewState._id === book._id
                  )[0]
                  .highlights.filter(
                    (highlightFromNewState) =>
                      highlightFromNewState._id === highlight._id
                  )[0].category,
              });
            }
          });
        }
      });

      //Handling request on server
    }
  };

  const addCategoryToUser = ({
    data,
    type,
    book_id,
    highlight_id,
  }: addCategoryToHighlightProps) => {
    //Checking if user is in demo mode
    const Demo = localStorage.getItem("Demo") === "true";
    const token = localStorage.getItem("token");

    //Need to find the current categories on highlights by filtering books by id and then filtering highlights by id
    if (userinfo && books) {
      let HighlightCategories = books
        .filter((book) => book._id === book_id)[0]
        .highlights.filter(
          (highlight) => highlight._id === highlight_id
        )[0].category;

      let updatedCategories =
        type === "add"
          ? [...userinfo.categories, data]
          : userinfo.categories.filter((eachCategory) => eachCategory !== data);

      updateUserInfo({
        ...userinfo,
        categories: updatedCategories,
      });

      //Handling request on server only if not in demo mode
      if (Demo && !token) return;

      addUserCategoryApi({
        data: updatedCategories,
      });

      //Adding it to the higlight it was created from
      if (type === "add" && !HighlightCategories.includes(data)) {
        addCategoryToHighlight({ type, data, book_id, highlight_id });
      }

      if (type === "remove" && HighlightCategories.includes(data)) {
        //Removing it from all highlights
        const arrayOfBookIds = books.reduce((acc, book) => {
          if (
            book.highlights.some((highlight) =>
              highlight.category.includes(data)
            )
          ) {
            acc.push(book._id);
          }
          return acc;
        }, [] as string[]);

        const arrayOfHighlightIds = books.reduce((acc, book) => {
          book.highlights.map((highlight) => {
            if (highlight.category.includes(data)) {
              acc.push(highlight._id);
            }
          });
          return acc;
        }, [] as string[]);

        addCategoryToHighlight({
          type,
          data,
          book_id: arrayOfBookIds,
          highlight_id: arrayOfHighlightIds,
        });
      }
    }
  };

  const addSummaryToBook = ({ data, book_id }: addSummaryToBookProps) => {
    //Checking if user is in demo mode
    const Demo = localStorage.getItem("Demo") === "true";
    const token = localStorage.getItem("token");

    if (books && data !== undefined && typeof book_id === "string") {
      const newState = books.map((book_context) => {
        //If book has same ID change rating locally
        if (book_id === book_context._id) {
          return { ...book_context, summary: data };
        } else return book_context;
      });

      //Handling request locally
      updateBooks(newState);

      //Handling request on server only if not in demo mode
      if (Demo && !token) return;
      summariseBookApi({ book_id: book_id, data: data });
    }
  };

  const markBookAsAnnotated = ({ book_id }: markBookAsAnnotatedProps) => {
    //Checking if user is in demo mode
    const Demo = localStorage.getItem("Demo") === "true";
    const token = localStorage.getItem("token");

    if (books && typeof book_id === "string") {
      const data = !books.filter((book) => book._id === book_id)[0].annotated;

      const newState = books.map((book_context) => {
        //If book has same ID change rating locally
        if (book_id === book_context._id) {
          return { ...book_context, annotated: data };
        } else return book_context;
      });
      //Handling request locally
      updateBooks(newState);

      //Handling request on server only if not in demo mode
      if (Demo && !token) return;
      markAsAnnotatedApi({ book_id: book_id, data: data });
    }
  };

  const updateBookCover = ({ data, book_id }: updateBookCoverProps) => {
    //Checking if user is in demo mode
    const Demo = localStorage.getItem("Demo") === "true";
    const token = localStorage.getItem("token");

    if (books && data && typeof book_id === "string") {
      const newState = books.map((book_context) => {
        //If book has same ID change rating locally
        if (book_id === book_context._id) {
          return { ...book_context, cover_image: data };
        } else return book_context;
      });
      //Handling request locally
      updateBooks(newState);

      //Handling request on server only if not in demo mode
      if (Demo && !token) return;
      changeBookImageApi({ book_id: book_id, data: data });
    }
  };

  const deleteBook = ({ book_id }: { book_id: string }) => {
    //Checking if user is in demo mode
    const Demo = localStorage.getItem("Demo") === "true";
    const token = localStorage.getItem("token");

    if (books && typeof book_id === "string") {
      const value = !books.filter((book) => book._id === book_id)[0].deleted;

      const newState = books.map((book_context) => {
        //If book has same ID delete it locally
        if (book_id === book_context._id) {
          return { ...book_context, deleted: value };
        } else return book_context;
      });
      //Handling request locally
      updateBooks(newState);

      //Handling request on server only if not in demo mode
      if (Demo && !token) return;
      deleteBookApi({ book_id: book_id, data: value });
    }
  };

  return {
    addRating,
    addGenreToBook,
    addGenreToUser,
    favouriteHighlight,
    deleteHighlight,
    annotateHighlight,
    addCategoryToHighlight,
    addCategoryToUser,
    addSummaryToBook,
    updateBookCover,
    markBookAsAnnotated,
    deleteBook,
  };
}

export default HandleChanges;
