import React, { useState, useEffect, useContext } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import rateBookApi from "@/api/Books/RateBookAPI";
import addGenreToBookApi from "@/api/Books/AddGenreToBook";
import { colorMapKeys } from "./sortGenreColors";
import addGenreToUserApi from "@/api/Users/AddGenre";
import favouriteHighlightApi from "@/api/Highlights/Favourite";
import addHighlightCategoryApi from "@/api/Highlights/AddCategories";
import addUserCategoryApi from "@/api/Users/AddCategories";
import summariseBookApi from "@/api/Books/Summary";
import annotateHighlightApi from "@/api/Highlights/Annotate";

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
  book_id: string | undefined | string[];
  highlight_id: string;
}

export interface addCategoryToHighlightProps {
  type: "add" | "remove";
  data: string;
  book_id: string | undefined | string[];
  highlight_id: string;
}

export interface addSummaryToBookProps {
  data: string | undefined;
  book_id: string | undefined | string[];
}

function HandleChanges() {
  const { updateBooks, books, userinfo, updateUserInfo } =
    useContext(KTON_CONTEXT);

  const addRating = ({ data, book_id }: RatingProps) => {
    if (books) {
      const newState = books.map((book_context) => {
        //If book has same ID change rating locally
        if (book_id === book_context._id) {
          return { ...book_context, rating: data };
        } else return book_context;
      });
      updateBooks(newState);
      rateBookApi({ book_id: book_id, data: data });
    }
  };

  const addGenreToBook = ({ data, book_id, type }: GenreProps) => {
    if (books) {
      //Sorting on Context
      const newState = books.map((book_context) => {
        if (book_id === book_context._id) {
          return {
            ...book_context,
            genre:
              type === "add"
                ? [...book_context.genre, data]
                : book_context.genre.filter((eachGenre) => eachGenre !== data),
          };
        } else return book_context;
      });
      updateBooks(newState);

      //sorting on server
      addGenreToBookApi({
        book_id: book_id,
        data: newState.filter((book) => book._id === book_id)[0].genre,
      });
    }
  };

  const addGenreToUser = ({ data, book_id, type, color }: GenreProps) => {
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

      //Sorting on server
      addGenreToUserApi({ data: newState.genres });

      //We could be removing from user geres but it may not be on the highlight, so we need to check before removing and wasting a request
      //When we add to user genres, we also need to add to book genres, so we can just add to book categories
      if (
        (book && type === "remove" && book.genre.includes(data)) ||
        (book && type === "add" && !book.genre.includes(data))
      ) {
        addGenreToBook({ type, data, book_id });
      }
    }
  };

  const favouriteHighlight = ({
    data,
    book_id,
    highlight_id,
  }: favouriteHighlightProps) => {
    if (books) {
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
      updateBooks(newState);

      //Handling request on server
      favouriteHighlightApi({
        book_id,
        highlight_id: highlight_id,
        data: data,
      });
    }
  };

  const deleteHighlight = ({ book_id, highlight_id }: deleteHighlightProps) => {
    if (books) {
      //Handling request locally
      const newState = books.map((book_context) => {
        if (book_id === book_context._id) {
          return {
            ...book_context,
            highlights: book_context.highlights.map((highlight) => {
              if (highlight._id === highlight_id) {
                return { ...highlight, deleted: true };
              } else return highlight;
            }),
          };
        } else return book_context;
      });
      updateBooks(newState);
    }
  };

  const annotateHighlight = ({
    data,
    book_id,
    highlight_id,
  }: annotateHighlightProps) => {
    console.log("Called");
    if (books) {
      //Handling request locally
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
      updateBooks(newState);

      //Handling request on server
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
    console.log("Called");
    if (books) {
      //Handling request locally
      const newState = books.map((book_context) => {
        if (book_id === book_context._id) {
          return {
            ...book_context,
            highlights: book_context.highlights.map((highlight) => {
              if (highlight._id === highlight_id) {
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
      updateBooks(newState);

      //Handling request on server
      addHighlightCategoryApi({
        book_id,
        highlight_id: highlight_id,
        data: newState
          .filter((book) => book._id === book_id)[0]
          .highlights.filter((highlight) => highlight._id === highlight_id)[0]
          .category,
      });
    }
  };

  const addCategoryToUser = ({
    data,
    type,
    book_id,
    highlight_id,
  }: addCategoryToHighlightProps) => {
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

      //Handling request on server
      addUserCategoryApi({
        data: updatedCategories,
      });

      //Also need to add/remove to highlight
      //We could be removing from user categories but it may not be on the highlight, so we need to check before removing and wasting a request
      //When we add to user categories, we also need to add to highlight categories, so we can just add to highlight categories
      if (
        (type === "remove" && HighlightCategories.includes(data)) ||
        (type === "add" && !HighlightCategories.includes(data))
      ) {
        addCategoryToHighlight({ type, data, book_id, highlight_id });
      }
    }
  };

  const addSummaryToBook = ({ data, book_id }: addSummaryToBookProps) => {
    if (books && data) {
      const newState = books.map((book_context) => {
        //If book has same ID change rating locally
        if (book_id === book_context._id) {
          return { ...book_context, summary: data };
        } else return book_context;
      });
      updateBooks(newState);
      summariseBookApi({ book_id: book_id, data: data });
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
  };
}

export default HandleChanges;
