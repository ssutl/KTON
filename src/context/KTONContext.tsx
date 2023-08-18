import React, { createContext, useState } from "react";
import { Book, Meta_con_highlight, userInfo } from "../api/Interface";
import { set } from "lodash";
import Books_AllHighlights from "@/helpers/Books_AllHighlights";

interface KTONContextProps {
  userinfo: userInfo | undefined;
  books: Book[] | undefined;
  highlights: Meta_con_highlight[] | undefined;
  updateUserInfo: (value: userInfo | undefined) => void;
  updateBooks: (value: Book[] | undefined) => void;
}

//The initial context of the app for authed users will have everything empty and undefined until InitAPI is called
const InitialContext: KTONContextProps = {
  userinfo: undefined,
  books: undefined,
  highlights: undefined,
  updateBooks: () => {},
  updateUserInfo: () => {},
};

export const KTON_CONTEXT = createContext<KTONContextProps>(InitialContext);

export const KTON_Provider = ({ children }: any) => {
  //Creating the main state where everything will be stored
  const [userinfo, setUserInfo] = useState<userInfo | undefined>(
    InitialContext.userinfo
  );
  const [books, setBooks] = useState<Book[] | undefined>(InitialContext.books);
  const [highlights, setHighlights] = useState<
    Meta_con_highlight[] | undefined
  >(InitialContext.highlights);

  //Creating the main functions to update each state
  const updateUserInfo = (value: userInfo | undefined) => {
    setUserInfo(value);
  };

  const updateBooks = (value: Book[] | undefined) => {
    if (value === undefined) {
      setBooks(undefined);
      setHighlights(undefined);
    } else {
      setBooks(value);
      setHighlights(Books_AllHighlights(value));
    }
  };

  //Wrapping the app in the provider
  return (
    <KTON_CONTEXT.Provider
      value={{
        userinfo,
        books,
        highlights,
        updateUserInfo,
        updateBooks,
      }}
    >
      {children}
    </KTON_CONTEXT.Provider>
  );
};
