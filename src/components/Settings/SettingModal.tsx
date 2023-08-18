import styles from "../../styles/Components/SettingModal.module.scss";
import React, { useState, useEffect, useContext } from "react";
import SettingContent, { SettingOption } from "./SettingContent";
import createPortal from "@/api/Membership/create_portal";
import { KTON_CONTEXT } from "../../context/KTONContext";
import { useRouter } from "next/router";
import createCheckout from "@/api/Membership/create_checkout";

const SettingModal = () => {
  const { userinfo } = useContext(KTON_CONTEXT);
  console.log("userinfo", userinfo);
  const router = useRouter();

  //Create a list of settings features with a name for the page they belong to, whether they have a toggle button, a input or none. and what happens on click.
  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined);
  const [selectedSetting, setSelectedSetting] = useState<"Books" | "Account">(
    "Account"
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

  const handleCustomerPortal = async () => {
    if (userinfo?.stripe_customer_id) {
      console.log("clicked");
      const response = await createPortal({
        customer_id: userinfo.stripe_customer_id,
      });

      router.push(response);
    }
  };

  const handleCreateCheckoutSession = async () => {
    // createCheckout({price_id})
  };

  const settings: SettingOption[] = [
    {
      name: "Account",
      features: [
        {
          name: "Manage membership billing",
          description: "Manage your membership and payment settings",
          button: (
            <div
              className={styles.button}
              onClick={() => handleCustomerPortal()}
            >
              Manage
            </div>
          ),
        },
        {
          name: "Delete Account",
          description: "Delete your account and all your data",
          button: <div className={styles.button}>Delete Account</div>,
        },
        {
          name: "Manage membership plan",
          description: "Upgrade or downgrade your membership plan",
          button: (
            <>
              <div
                className={`${styles.button} ${
                  !userinfo?.subscription ? styles.kton_active : ""
                }`}
              >
                Free
              </div>
              <div
                className={`${styles.button} ${
                  userinfo?.subscription ? styles.kton_active : ""
                }`}
                onClick={() => handleCreateCheckoutSession()}
              >
                Premium
              </div>
            </>
          ),
        },
      ],
    },
    {
      name: "Books",
      features: [
        {
          name: "Delete Books",
          description: "Delete all your books",
          button: <div className={styles.button}>Delete Books</div>,
        },
        {
          name: "Restore Deleted Books",
          description: "Restore all your deleted books",
          input: true,
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
          <div className={styles.settingHeader}>
            <p>Settings</p>
          </div>
          {settings.map((setting, i) => {
            return (
              <div
                key={i}
                className={styles.settingOption}
                onClick={() => setSelectedSetting(setting.name)}
              >
                <h3>{setting.name}</h3>
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
