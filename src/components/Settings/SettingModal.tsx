import styles from "../../styles/Components/SettingModal.module.scss";
import React, { useState, useEffect } from "react";
import SettingContent, { SettingOption } from "./SetingContent";

const SettingModal = () => {
  //Create a list of settings features with a name for the page they belong to, whether they have a toggle button, a input or none. and what happens on click.
  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined);
  const [selectedSetting, setSelectedSetting] = useState<"General" | "Account">(
    "General"
  );

  useEffect(() => {
    //Have to set screenwidth to conditionally change size of heat map
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", () => handleResize());

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const settings: SettingOption[] = [
    {
      name: "General",
      features: [
        {
          name: "Dark Mode",
          toggle: true,
          onClick: () => {
            //Toggle dark mode
          },
        },
        {
          name: "Change Name",
          input: true,
          onClick: () => {
            //Open input modal
          },
        },
      ],
    },
    {
      name: "Account",
      features: [
        {
          name: "Change Password",
          onClick: () => {
            //Open input modal
          },
        },
        {
          name: "Delete Account",
          onClick: () => {
            //Open input modal
          },
        },
      ],
    },
  ];

  if (!screenWidth) return null;

  return (
    <div className={styles.pageOverlay}>
      <div className={styles.settingModal}>
        <div className={styles.mobileHeader}>
          <p>Settings</p>
          <p>done</p>
        </div>
        <div className={styles.leftHalf}>
          {settings.map((setting, i) => {
            return (
              <div key={i} className={styles.settingSection}>
                <h2 onClick={() => setSelectedSetting(setting.name)}>
                  {setting.name}
                </h2>
              </div>
            );
          })}
        </div>
        <div className={styles.rightHalf}>
          {screenWidth < 1024 ? (
            settings.map((setting, i) => {
              return <SettingContent key={i} settingOption={settings[i]} />;
            })
          ) : (
            <SettingContent
              settingOption={
                settings.filter(
                  (eachSetting) => eachSetting.name === selectedSetting
                )[0]
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
