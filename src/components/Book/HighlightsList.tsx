import { Book, Book_highlight, Meta_con_highlight } from "@/api/Interface";
import Highlight from "./Highlight";
import bookPageStyles from "../../styles/Pages/BookPage.module.scss";
import { KTON_CONTEXT } from "../../context/KTONContext";
import React, { useContext } from "react";

interface HighlightsListProps {
  book: Book;
  selectedSort: "Recent" | "Oldest" | "Length";
  selectedFilter: string | "starred" | undefined;
}

const HighlightsList: React.FC<HighlightsListProps> = ({
  book,
  selectedSort,
  selectedFilter,
}) => {
  const { userinfo } = useContext(KTON_CONTEXT);

  const userSubscribed =
    userinfo &&
    userinfo.subscription_end !== null &&
    new Date(userinfo.subscription_end) > new Date();

  if (book)
    return (
      <div className={bookPageStyles.highlightList}>
        {!userSubscribed && book.highlights.length > 100 && (
          <div className={bookPageStyles.freeBanner}>
            <h3>
              Your highlights have been limited to the first 100, you can
              upgrade to premium to view all and unlock more features,
              don&apos;t miss out!
            </h3>
            <p
              className={bookPageStyles.button}
              onClick={() => {
                document.getElementById("settingBTN")?.click();
                setTimeout(() => {
                  document.getElementById("Upgrade")?.click();
                }, 20);
              }}
            >
              Upgrade
            </p>
          </div>
        )}
        {book.highlights
          .slice(0, userSubscribed ? book.highlights.length : 100)
          .filter((eachHighlight) => eachHighlight.deleted === false)
          .sort((a: Book_highlight, b: Book_highlight) => {
            if (selectedSort === "Length") {
              return b.Text.length - a.Text.length;
            } else if (selectedSort === "Recent") {
              return new Date(b.Date).getTime() - new Date(a.Date).getTime();
            } else if (selectedSort === "Oldest") {
              return new Date(a.Date).getTime() - new Date(b.Date).getTime();
            } else return 0;
          })
          .filter((eachHighlight) =>
            selectedFilter === "s_tarred_1"
              ? eachHighlight.starred === true
              : selectedFilter
              ? eachHighlight.category.includes(selectedFilter)
              : eachHighlight
          )
          .map((eachHighlight, index) => (
            <Highlight highlight={eachHighlight} key={index} index={index} />
          ))}
      </div>
    );
  else null;
};

export default HighlightsList;
