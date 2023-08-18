import styles from "../../styles/Components/ExportCard.module.scss";
import Image, { StaticImageData } from "next/image";
import { Tooltip } from "react-tooltip";
import { KTON_CONTEXT } from "../../context/KTONContext";
import React, { useContext } from "react";

export interface ExportCardProps {
  option: {
    name: string;
    image: StaticImageData;
    description: string;
    onClick: () => void;
  };
}

const ExportCard = ({ option }: ExportCardProps) => {
  const { userinfo } = useContext(KTON_CONTEXT);

  return (
    <div
      className={styles.exportCard}
      onClick={() => option.onClick()}
      data-tooltip-id={`my-tooltip-${option.name}-${userinfo?.subscription}`}
      data-tooltip-content="Notion currently has a limit of 100 highlights and 2000 characters per highlight. 📖"
    >
      <div className={styles.ImageHalf}>
        <div className={styles.imageContainer}>
          <Image src={option.image} alt={option.name} />
        </div>
      </div>
      <div className={styles.TextHalf}>
        <h3 id={styles.title}>{option.name}</h3>
        <p id={styles.description}>{option.description}</p>
      </div>
      <Tooltip
        id={`my-tooltip-Notion-true`}
        className={styles.toolTip}
        noArrow
      />
    </div>
  );
};

export default ExportCard;
