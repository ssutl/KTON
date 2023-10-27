import styles from "../../styles/Components/SettingModal.module.scss";
import React, { useState, useEffect, useContext } from "react";
import SettingContent, { SettingOption } from "./SettingContent";
import createPortal from "@/api/Membership/create_portal";
import { KTON_CONTEXT } from "../../context/KTONContext";
import { useRouter } from "next/router";
import createCheckout from "@/api/Membership/create_checkout";
import Modal_Confirmation from "../Modals/Modal_Confirmation";
import NotionApi from "@/api/Notion/NotionApi";
import { useAlert } from "react-alert";
import csvApi from "@/api/CSV/csvApi";

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
    "Account" | "Books & Highlights" | "Import" | "Upgrade" | "Export"
  >("Account");
  const alert = useAlert();

  const userSubscribed =
    userinfo &&
    userinfo.subscription_end !== null &&
    new Date(userinfo.subscription_end) > new Date();

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
    if (!userinfo) return;

    try {
      const url = await createPortal({
        customer_id: userinfo.stripe_customer_id,
      });

      window.open(url, "_ blank");
    } catch (error) {}
  };

  const handleCreateCheckoutSession = async (price_id: string) => {
    if (!userinfo) return;

    try {
      const url = await createCheckout({
        price_id,
        success_url: `https://app.kton.xyz${router.pathname}`,
        cancel_url: `https://app.kton.xyz${router.pathname}`,
        stripe_customer_id: userinfo.stripe_customer_id,
      });

      window.open(url, "_ blank");
    } catch (error) {}
  };

  const handleCSVApi = async () => {
    try {
      const response = await csvApi();
      if (response === "success") {
        alert.show("Successfully exported to CSV", {
          type: "success",
        });
      }
    } catch (err) {
      alert.show("Error exporting to CSV", {
        type: "error",
      });
    }
  };

  const settings: SettingOption[] = [
    {
      name: "Account",
      showCondition: true,
      features: [
        {
          name: "Manage membership billing",
          description: "Manage your membership and payment settings",
          button: (
            <p className={styles.button} onClick={() => handleCustomerPortal()}>
              Manage
            </p>
          ),
          showCondition: userSubscribed,
        },
        {
          name: "Current Membership Plan",
          description: "View your current membership plan",
          button: (
            <>
              <p
                className={`${styles.button} ${
                  !userSubscribed ? styles.kton_active : ""
                }`}
              >
                Free
              </p>
              <p
                className={`${styles.button} ${
                  userSubscribed ? styles.kton_active : ""
                }`}
                onClick={() =>
                  userSubscribed ? null : setSelectedSetting("Upgrade")
                }
              >
                Premium
              </p>
            </>
          ),
          showCondition: true,
        },
        {
          name: "Membership End Date",
          description: `${
            userinfo && userinfo?.subscription_end !== null
              ? new Date(userinfo.subscription_end).toDateString()
              : "N/A"
          }`,
          showCondition: userSubscribed,
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
                router.replace("/");
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                updateBooks(undefined);
                handleSettingsModal();
              }}
            >
              Logout
            </p>
          ),
          showCondition: true,
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
          showCondition: true,
        },
      ],
    },
    {
      name: "Books & Highlights",
      showCondition: true,
      features: [
        {
          name: "Handle Books",
          description: "Delete or restore particular books",
          showCondition: true,
        },
        {
          name: "Restore Highlights",
          description: "Restore deleted highlights",
          showCondition: true,
        },
      ],
    },
    {
      name: "Import",
      showCondition: true,
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
          showCondition: true,
        },
      ],
    },
    {
      name: "Export",
      showCondition: true,
      features: [
        {
          name: "Export to Notion",
          description: "Export highlights to Notion database",
          image: "/images/notion.png",
          button: (
            <p
              className={styles.button}
              onClick={() => {
                if (userSubscribed) {
                  //Open in new tab instead
                  window.open(
                    "https://api.notion.com/v1/oauth/authorize?client_id=7081a522-2c1f-445b-8a37-d73e11076dcd&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fapp.kton.xyz%2FExport",
                    "_blank"
                  );
                } else {
                  alert.show(
                    "Only premium members can access notion exporting",
                    {
                      type: "info",
                    }
                  );
                }
              }}
            >
              Export
            </p>
          ),
          showCondition: true,
        },
        {
          name: "Export to CSV",
          description: "Export highlights to CSV file",
          image: "/images/excel.png",
          button: (
            <p
              className={styles.button}
              onClick={() => {
                handleCSVApi();
              }}
            >
              Export
            </p>
          ),
          showCondition: true,
        },
      ],
    },
    {
      name: "Upgrade",
      showCondition: !userSubscribed,
      features: [
        {
          name: "Upgrade to Premium",
          description:
            "Upgrade to premium to unlock all features: Notion integration, unlimited highlights, unlimited highlight categories, and more!",
          button: (
            <>
              <p
                className={styles.button}
                onClick={() => {
                  handleCreateCheckoutSession("price_1Nh0z1KPa3aWR3TfGDgtGqgD");
                }}
              >
                $3 per month
              </p>
              <p
                className={styles.button}
                onClick={() => {
                  handleCreateCheckoutSession("price_1Nh0z1KPa3aWR3TfK3PiysV4");
                }}
              >
                $30 per year
              </p>
            </>
          ),
          showCondition: true,
        },
      ],
    },
  ].filter((eachSetting) => eachSetting.showCondition) as SettingOption[];

  if (!screenWidth) return null;

  return (
    <div
      className={styles.pageOverlay}
      onMouseDown={() => handleSettingsModal()}
    >
      {displayConfirmationModal && (
        <Modal_Confirmation
          closeModal={() => setDisplayConfirmationModal(false)}
          closeSettingModal={() => handleSettingsModal()}
        />
      )}
      <div
        className={styles.settingModal}
        onMouseDown={(e) => e.stopPropagation()}
      >
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
                id={setting.name}
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
