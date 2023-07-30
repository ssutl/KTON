import styles from "../styles/MembershipCard.module.scss";
import create_checkout from "@/api/Membership/create_checkout";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import { KTON_CONTEXT } from "../context/KTONContext";
import userAuthenticated from "@/helpers/UserAuthenticated";

interface MembershipCardProps {
  type: "Preview" | "Free" | "Premium";
  setLoginModal: () => void;
}

const MembershipCard = ({ type, setLoginModal }: MembershipCardProps) => {
  const router = useRouter();
  const { userinfo } = useContext(KTON_CONTEXT);
  const [restrictions, setRestrictions] = useState(true);

  const currentPlan = userinfo?.subscription
    ? "Premium"
    : restrictions
    ? "Preview"
    : "Free";

  const [billing_type, setBillingType] = useState<"Monthly" | "Anually">(
    "Monthly"
  );
  const [price, setPrice] = useState(0);

  useEffect(() => {
    setRestrictions(!userAuthenticated());
  }, []);

  useEffect(() => {
    if (type === "Premium") {
      if (billing_type === "Monthly") {
        setPrice(3);
      } else {
        setPrice(36);
      }
    }
  }, [billing_type]);

  const previewFeatures = [
    "Import & view kindle highlights",
    "Share highlights as image (watermarked)",
    "Easily browse & search your entire highlight library",
  ];

  const freeFeatures = [
    "Everything in preview plan",
    "Categorise books",
    "Organise your highlights with tags & notes",
  ];

  const premiumFeatures = [
    "Everything in free plan",
    "Various integrations including Notion & Anki",
    "Detailed analytics & insights in the form of charts & graphs",
  ];

  return (
    <div
      className={`${styles.membershipCard} ${
        currentPlan === type ? styles.activePlan : ""
      }`}
      onClick={async () => {
        if (type === "Premium") {
          try {
            const url = await create_checkout({
              price_id: "price_1NUZdSKPa3aWR3Tf7nc1SplP",
              success_url: "http://localhost:3000/Home",
              cancel_url: "http://localhost:3000/",
            });

            router.push(url);
          } catch (err) {
            console.log(err);
          }
        } else if (type === "Free") {
          //Open login modal
          setLoginModal();
        }
      }}
    >
      <div className={styles.membershipCardHeader}>
        <h2>{type}</h2>
        {type === "Premium" && (
          <p
            onClick={(e) => {
              e.stopPropagation();
              if (billing_type === "Monthly") {
                setBillingType("Anually");
              } else {
                setBillingType("Monthly");
              }
            }}
          >
            Prefer to pay {billing_type === "Anually" ? "monthly" : "anually"}?{" "}
            <span>Click here</span>
          </p>
        )}
      </div>
      <div className={styles.membershipCardPrice}>
        <h1>${price}</h1>
        <h2>/{billing_type}</h2>
      </div>
      <div className={styles.membershipCardFeatures}>
        {type === "Preview" &&
          previewFeatures.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <h3>✅ {feature}</h3>
            </div>
          ))}
        {type === "Free" &&
          freeFeatures.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <h3>✅ {feature}</h3>
            </div>
          ))}
        {type === "Premium" &&
          premiumFeatures.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <h3>✅ {feature}</h3>
            </div>
          ))}
      </div>
      {(type === "Preview" && currentPlan !== "Preview") ||
      (type === "Premium" && currentPlan === "Preview") ? null : (
        <div className={styles.membershipButtonSection}>
          <div className={styles.membershipButton}>
            <p>
              {currentPlan === type
                ? `Current plan`
                : type === "Premium"
                ? `Choose plan`
                : `Sign in to upgrade`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipCard;
