import { Book } from "@/api/Interface";
import React, { useState, useEffect, useContext, useRef } from "react";
import BookComponent from "./BookComponent";

//Books passed from library
const BooksList: React.FC<{
  books: Book[];
  selectedSort: "Recent" | "Rating" | "Oldest";
  selectedFilter: string | undefined;
}> = ({ books, selectedSort, selectedFilter }) => {
  if (!books) return null;

  return (
    <>
      {books
        .sort((a: Book, b: Book) => {
          if (selectedSort === "Rating") {
            return b.rating - a.rating;
          } else if (selectedSort === "Recent") {
            return (
              new Date(b.upload_date).getTime() -
              new Date(a.upload_date).getTime()
            );
          } else if (selectedSort === "Oldest") {
            return (
              new Date(a.upload_date).getTime() -
              new Date(b.upload_date).getTime()
            );
          } else return 0;
        })
        .filter((eachBook) =>
          selectedFilter ? eachBook.genre.includes(selectedFilter) : eachBook
        )
        .filter((eachBook) => eachBook.deleted === false)
        .map((eachBook, i) => (
          <BookComponent book={eachBook} index={i} key={i} />
        ))}
    </>
  );
};

export default BooksList;
