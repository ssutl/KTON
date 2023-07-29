import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Book.module.scss";
import { Book } from "@/api/Interface";
import Tilt from "react-parallax-tilt";
import userAuthenticated from "@/helpers/UserAuthenticated";
import { usePalette } from "react-palette";
import { useRouter } from "next/router";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import cleanAuthor from "@/helpers/cleanAuthor";
import HandleChanges from "@/helpers/HandleChanges";

interface BookProps {
  book: Book;
  index: number;
}

const BookComponent = ({ book, index }: BookProps) => {
  //Getting the most vibrant color
  const { data } = usePalette(book.cover_image);
  const [restrictions, setRestrictions] = useState(true);
  const [imageIsValid, setImageIsValid] = useState(true);
  const [isMouseInside, setIsMouseInside] = useState(false);
  const { addRating } = HandleChanges();
  const router = useRouter();

  //Tracking the mouse position to make the hover effect
  const handleMouseEnter = () => {
    setIsMouseInside(true);
  };
  const handleMouseLeave = () => {
    setIsMouseInside(false);
  };
  //Tracking the mouse position to make the hover effect

  //Setting restrictions on page load
  useEffect(() => {
    setRestrictions(!userAuthenticated());
  }, []);

  return (
    <div
      className={styles.Book}
      onClick={() => router.push(`Book/${restrictions ? index : book._id}`)}
    >
      <div
        className={styles.ImageSection}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={isMouseInside ? `${styles.blurEffect}` : ""}
          style={{ "--background-color": data.vibrant } as React.CSSProperties}
        ></div>
        <Tilt
          glareEnable={true}
          glareMaxOpacity={0.4}
          glarePosition="all"
          glareReverse={true}
          glareBorderRadius="0px"
          tiltEnable={true}
          // trackOnWindow={true}
          className={styles.ImageHolder}
          gyroscope={true}
          perspective={850}
        >
          {!restrictions && imageIsValid ? (
            <img
              draggable="false"
              alt="ebook cover image"
              src={book.cover_image}
              className={styles.image}
              onError={({ currentTarget }) => {
                setImageIsValid(false);
              }}
            />
          ) : (
            <div className={styles.NoImage}></div>
          )}
        </Tilt>
      </div>
      <div className={styles.Book_Meta_Section}>
        <div className={styles.Meta_center}>
          <h2>{book.title}</h2>
          <p>{cleanAuthor(book.author)}</p>
          {restrictions ? null : (
            <p>
              {[...Array(5)].map((eachStar, i) => {
                const isFilled = i < book.rating;
                const starIcon = isFilled ? (
                  <StarIcon className={styles.star} />
                ) : (
                  <StarBorderIcon className={styles.star} />
                );
                return (
                  <span
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newRating = isFilled ? i : i + 1;
                      addRating({ data: newRating, book_id: book._id });
                    }}
                  >
                    {starIcon}
                  </span>
                );
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookComponent;
