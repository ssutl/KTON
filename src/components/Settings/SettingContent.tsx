import styles from "../../styles/Components/settingContent.module.scss";
import { KTON_CONTEXT } from "../../context/KTONContext";
import React, { useContext } from "react";

export interface SettingFeature {
  name: string;
  description: string;
  input?: boolean;
  button?: JSX.Element;
  list?: JSX.Element;
}

export interface SettingOption {
  name: "Account" | "Books & Highlights";
  features: SettingFeature[];
}

const SettingContent = ({
  settingOption,
}: {
  settingOption: SettingOption;
}) => {
  const { books } = useContext(KTON_CONTEXT);

  return (
    <div className={styles.settingContentContainer}>
      <div className={styles.settingContentHeader}>
        <h1>{settingOption.name}</h1>
      </div>
      {settingOption.features.map((feature, i) => {
        return (
          <>
            <div key={i} className={styles.settingSelect}>
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
                      >
                        {book.deleted ? "Restore" : "Delete"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </>
        );
      })}
    </div>
  );
};

export default SettingContent;
