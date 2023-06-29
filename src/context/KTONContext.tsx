import React, { createContext, useState } from "react";
import { Book, Meta_con_highlight, userInfo } from "../api/Interface";

interface KTONContextProps {
  userinfo: userInfo | undefined;
  books: Book[] | undefined;
  highlights: Meta_con_highlight[] | undefined;
  updateUserInfo: (value: userInfo | undefined) => void;
  updateBooks: (value: Book[] | undefined) => void;
  updateHighlights: (value: Meta_con_highlight[] | undefined) => void;
}

const InitialContext: KTONContextProps = {
  userinfo: undefined,
  books: undefined,
  highlights: undefined,
  updateBooks: () => {},
  updateUserInfo: () => {},
  updateHighlights: () => {},
};

export const KTON_CONTEXT = createContext<KTONContextProps>(InitialContext);

export const KTON_Provider = ({ children }: any) => {
  const [userinfo, setUserInfo] = useState<userInfo | undefined>(
    InitialContext.userinfo
  );
  const [books, setBooks] = useState<Book[] | undefined>(InitialContext.books);
  const [highlights, setHighlights] = useState<
    Meta_con_highlight[] | undefined
  >(InitialContext.highlights);

  const updateUserInfo = (value: userInfo | undefined) => {
    setUserInfo(value);
  };

  const updateBooks = (value: Book[] | undefined) => {
    setBooks(value);
  };

  const updateHighlights = (value: Meta_con_highlight[] | undefined) => {
    setHighlights(value);
  };

  return (
    <KTON_CONTEXT.Provider
      value={{
        userinfo,
        books,
        highlights,
        updateUserInfo,
        updateBooks,
        updateHighlights,
      }}
    >
      {children}
    </KTON_CONTEXT.Provider>
  );
};
