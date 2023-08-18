import styles from "../../styles/Components/SettingModal.module.scss";
import React, { useState, useEffect, useContext } from "react";
import SettingContent, { SettingOption } from "./SettingContent";
import createPortal from "@/api/Membership/create_portal";
import { KTON_CONTEXT } from "../../context/KTONContext";
import { useRouter } from "next/router";
import createCheckout from "@/api/Membership/create_checkout";
import Modal_Type_Save from "../Modals/Modal_Type_Save";
import Modal_Confirmation from "../Modals/Modal_Confirmation";

export interface SettingModalProps {
  handleSettingsModal: () => void;
}

const SettingModal = ({ handleSettingsModal }: SettingModalProps) => {
  const { userinfo, updateBooks } = useContext(KTON_CONTEXT);
  const router = useRouter();
  const [screenWidth, setScreenWidth] = useState<number | undefined>(undefined);
  const [displayConfirmationModal, setDisplayConfirmationModal] =
    useState(false);
  const [selectedSetting, setSelectedSetting] = useState<
    "Books & Highlights" | "Account" | "Import & Export"
  >("Account");

  useEffect(() => {
    //Have to set screenwidth to conditionally change size of heat map
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", () => handleResize());

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //Add overflow hidden to element behind when modal is open
  useEffect(() => {
    const scrollHalf = document.body;
    if (scrollHalf) {
      scrollHalf.style.overflow = "hidden";
      return () => {
        scrollHalf.style.overflow = "auto";
      };
    }
  }, []);

  const handleCustomerPortal = async () => {
    if (!userinfo?.stripe_customer_id) return null;

    try {
      const url = await createPortal({
        customer_id: userinfo.stripe_customer_id,
      });

      router.push(url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateCheckoutSession = async () => {
    try {
      const url = await createCheckout({
        price_id: "price_1NUZdSKPa3aWR3Tf7nc1SplP",
        success_url: `http://localhost:3000/${router.pathname}`,
        cancel_url: `http://localhost:3000/${router.pathname}`,
      });

      router.push(url);
    } catch (error) {
      console.log(error);
    }
  };

  const settings: SettingOption[] = [
    {
      name: "Account",
      features: [
        {
          name: "Manage membership billing",
          description: "Manage your membership and payment settings",
          button: (
            <p className={styles.button} onClick={() => handleCustomerPortal()}>
              Manage
            </p>
          ),
        },
        {
          name: "Delete Account",
          description: "Delete your account and all your data",
          button: (
            <p
              className={styles.button}
              onClick={() => setDisplayConfirmationModal(true)}
            >
              Delete Account
            </p>
          ),
        },
        {
          name: "Manage membership plan",
          description: "Upgrade or downgrade your membership plan",
          button: (
            <>
              <p
                className={`${styles.button} ${
                  !userinfo?.subscription ? styles.kton_active : ""
                }`}
              >
                Free
              </p>
              <p
                className={`${styles.button} ${
                  userinfo?.subscription ? styles.kton_active : ""
                }`}
                onClick={() => handleCreateCheckoutSession()}
              >
                Premium
              </p>
            </>
          ),
        },
        {
          name: "Logout",
          description: `Logout of your account: ${JSON.parse(
            localStorage.getItem("username") as string
          )} on KTON`,
          button: (
            <p
              className={styles.button}
              onClick={() => {
                router.push("/");
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                sessionStorage.removeItem("clippings");
                updateBooks(undefined);
                handleSettingsModal();
              }}
            >
              Logout
            </p>
          ),
        },
      ],
    },
    {
      name: "Import & Export",
      features: [
        {
          name: "Import Highlights",
          description: "Import highlights from your kindle device",
          button: (
            <p
              className={styles.button}
              onClick={() => {
                router.push("/Import");
                handleSettingsModal();
              }}
            >
              Import
            </p>
          ),
        },
        {
          name: "Export Highlights",
          description: "Export highlights to different formats",
          button: (
            <p
              className={styles.button}
              onClick={() => {
                router.push("/Export");
                handleSettingsModal();
              }}
            >
              Export
            </p>
          ),
        },
      ],
    },
    {
      name: "Books & Highlights",
      features: [
        {
          name: "Handle Books",
          description: "Delete or restore particular books",
        },
        {
          name: "Restore Highlights",
          description: "Restore deleted highlights",
        },
      ],
    },
  ];

  if (!screenWidth) return null;

  return (
    <div className={styles.pageOverlay} onClick={() => handleSettingsModal()}>
      {displayConfirmationModal && (
        <Modal_Confirmation
          closeModal={() => setDisplayConfirmationModal(false)}
        />
      )}
      <div className={styles.settingModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.mobileHeader}>
          <h3>Settings</h3>
          <h3 onClick={() => handleSettingsModal()} id={styles.done}>
            done
          </h3>
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
