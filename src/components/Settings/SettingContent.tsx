import styles from "../../styles/Components/settingContent.module.scss";

export interface SettingFeature {
  name: string;
  description: string;
  input?: boolean;
  button?: JSX.Element;
}

export interface SettingOption {
  name: "Account" | "Books";
  features: SettingFeature[];
}

const SettingContent = ({
  settingOption,
}: {
  settingOption: SettingOption;
}) => {
  return (
    <>
      <div className={styles.settingContentHeader}>
        <h1>{settingOption.name}</h1>
      </div>
      {settingOption.features.map((feature, i) => {
        return (
          <div key={i} className={styles.settingSelect}>
            <div className={styles.selectTextSection}>
              <p id={styles.selectName}>{feature.name}</p>
              <h3 id={styles.selectDescription}>{feature.description}</h3>
            </div>
            <div className={styles.buttonSection}>
              {feature.button && feature.button}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SettingContent;
