import React, { createContext, useState } from "react";
import { dbBook, singleHighlight, userInfo } from "../api/Interface";

interface KTONContextProps {
  userinfo: userInfo | undefined;
  books: dbBook[] | undefined;
  highlights: singleHighlight[] | undefined;
  updateUserInfo: (value: userInfo | undefined) => void;
  updateBooks: (value: dbBook[] | undefined) => void;
  updateHighlights: (value: singleHighlight[] | undefined) => void;
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
  const [books, setBooks] = useState<dbBook[] | undefined>(
    InitialContext.books
  );
  const [highlights, setHighlights] = useState<singleHighlight[] | undefined>(
    InitialContext.highlights
  );

  const updateUserInfo = (value: userInfo | undefined) => {
    setUserInfo(value);
  };

  const updateBooks = (value: dbBook[] | undefined) => {
    setBooks(value);
  };

  const updateHighlights = (value: singleHighlight[] | undefined) => {
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
