import React, { useState, useEffect } from "react";
import styles from "../styles/Book.module.scss";
import { Book } from "@/api/Interface";
import Tilt from "react-parallax-tilt";
import userAuthenticated from "@/helpers/UserAuthenticated";
import axios, { AxiosResponse } from "axios";
import { usePalette } from "react-palette";

interface BookProps {
  book: Book;
}

const BookComponent = ({ book }: BookProps) => {
  //Getting the most vibrant color
  const { data, loading, error } = usePalette(book.cover_image);
  const [restrictions, setRestrictions] = useState(true);
  const [imageIsValid, setImageIsValid] = useState(false);
  const [isMouseInside, setIsMouseInside] = useState(false);
  console.log("isMouseInside", isMouseInside);

  const handleMouseEnter = () => {
    setIsMouseInside(true);
  };

  const handleMouseLeave = () => {
    setIsMouseInside(false);
  };

  useEffect(() => {
    //Setting restrictions
    setRestrictions(!userAuthenticated());
  }, []);

  useEffect(() => {
    imageValid(book.cover_image)
      .then((isValid) => {
        setImageIsValid(isValid);
      })
      .catch((error) => {
        console.log(error);
        setImageIsValid(false);
      });
  }, [book.cover_image]);

  const imageValid = async (url: string) => {
    try {
      const response = await axios.head(url);
      return response.status === 200;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <div className={styles.Book}>
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
          glareMaxOpacity={0.1}
          glarePosition="all"
          glareBorderRadius="0px"
          tiltEnable={true}
          gyroscope={true}
          className={styles.ImageHolder}
          perspective={650}
        >
          {restrictions ? (
            <h3>
              Login to be able to get auto generated book images, and save your
              own
            </h3>
          ) : !imageIsValid && !restrictions ? (
            <h3>Cannot find image, feel free to add your own</h3>
          ) : (
            <img draggable="false" src={book.cover_image} className="image" />
          )}
        </Tilt>
      </div>
      <div className={styles.Book_Meta_Section}>
        <div className={styles.Meta_center}>
          <h3>{book.title}</h3>
          <p>
            {book.author.slice(-1) === ";"
              ? book.author.slice(0, -1)
              : book.author.replace(";", " & ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookComponent;
