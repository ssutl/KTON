import { Book, Book_highlight, Meta_con_highlight } from "@/api/Interface";
import Highlight from "./Highlight";
import bookPageStyles from "../../styles/Pages/BookPage.module.scss";

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
  if (book)
    return (
      <div className={bookPageStyles.highlightList}>
        {book.highlights
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
