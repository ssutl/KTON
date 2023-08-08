import { Book } from "@/api/Interface";
import Highlight from "./Highlight";
import HandleLoginModal from "../Login/HandleLoginModal";
import bookPageStyles from "../../styles/Book/BookPage.module.scss";

const HighlightsList: React.FC<{ book: Book }> = ({ book }) => {
  const { LoginModal, setLoginModal } = HandleLoginModal();

  if (book)
    return (
      <div className={bookPageStyles.highlightList}>
        {LoginModal()}
        {book.highlights
          .filter((eachHighlight) => eachHighlight.deleted !== true)
          .map((eachHighlight, index) => (
            <Highlight
              highlight={eachHighlight}
              key={index}
              setLoginModal={setLoginModal}
              index={index}
            />
          ))}
      </div>
    );
  else null;
};

export default HighlightsList;
