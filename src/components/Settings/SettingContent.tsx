import styles from "../../styles/Components/settingContent.module.scss";
import { KTON_CONTEXT } from "../../context/KTONContext";
import React, { useContext } from "react";
import HandleChanges from "@/helpers/HandleChanges";

export interface SettingFeature {
  name: string;
  description: string;
  input?: boolean;
  button?: JSX.Element;
  list?: JSX.Element;
}

export interface SettingOption {
  name: "Account" | "Books & Highlights" | "Import & Export";
  features: SettingFeature[];
}

const SettingContent = ({
  settingOption,
}: {
  settingOption: SettingOption;
}) => {
  const { books, highlights } = useContext(KTON_CONTEXT);
  console.log("books", books);
  const { deleteBook, deleteHighlight } = HandleChanges();

  return (
    <div className={styles.settingContentContainer}>
      <div className={styles.settingContentHeader}>
        <h1>{settingOption.name}</h1>
      </div>
      {settingOption.features.map((feature, i) => {
        return (
          <div className={styles.featureContainer} key={i}>
            <div className={styles.settingSelect}>
              <div className={styles.selectTextSection}>
                <p id={styles.selectName}>{feature.name}</p>
                <h3 id={styles.selectDescription}>{feature.description}</h3>
              </div>
              <div className={styles.buttonSection}>
                {feature.button && feature.button}
              </div>
            </div>
            <div className={styles.listSection}>
              {feature.name === "Handle Books" &&
                books &&
                books.map((book, i) => (
                  <div key={i} className={styles.listItem}>
                    <p id={styles.bookTitle}>{book.title}</p>
                    <div className={styles.listItemButtons}>
                      <p
                        className={`${styles.button} ${
                          book.deleted ? styles.restore : styles.delete
                        }`}
                        onClick={() => deleteBook({ book_id: book._id })}
                      >
                        {book.deleted ? "Restore" : "Delete"}
                      </p>
                    </div>
                  </div>
                ))}
              {feature.name === "Restore Highlights" &&
                highlights &&
                highlights
                  .filter((eachHighlight) => eachHighlight.highlight.deleted)
                  .map((meta_con_highlight, i) => (
                    <div key={i} className={styles.listItem}>
                      <p id={styles.bookTitle}>
                        {meta_con_highlight.highlight.Text}
                      </p>
                      <div className={styles.listItemButtons}>
                        <p
                          className={`${styles.button} ${
                            meta_con_highlight.highlight.deleted
                              ? styles.restore
                              : styles.delete
                          }`}
                          onClick={() =>
                            deleteHighlight({
                              highlight_id: meta_con_highlight.highlight._id,
                              book_id: meta_con_highlight.book_id,
                            })
                          }
                        >
                          Restore
                        </p>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SettingContent;
