import styles from "../../styles/Components/ExportCard.module.scss";
import Image, { StaticImageData } from "next/image";

export interface ExportCardProps {
  option: {
    name: string;
    image: StaticImageData;
    description: string;
    onClick: () => void;
  };
}

const ExportCard = ({ option }: ExportCardProps) => {
  return (
    <div className={styles.exportCard} onClick={() => option.onClick()}>
      <div className={styles.ImageHalf}>
        <div className={styles.imageContainer}>
          <Image src={option.image} alt={option.name} />
        </div>
      </div>
      <div className={styles.TextHalf}>
        <h3 id={styles.title}>{option.name}</h3>
        <p id={styles.description}>{option.description}</p>
      </div>
    </div>
  );
};

export default ExportCard;
