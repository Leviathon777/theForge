import React from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield } from "@fortawesome/free-solid-svg-icons";
import styles from "./MedalGrid.module.css";

const MedalGrid = ({ dots }) => {
  const hasMedals = dots && dots.length > 0;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <FontAwesomeIcon icon={faShield} /> Medal Collection
      </h2>

      <div className={styles.grid}>
        {hasMedals ? (
          dots.map((dot) => {
            const tierName = dot.metadata?.name?.replace(" MEDAL OF HONOR", "").trim() || "UNKNOWN";
            const tierSlug = tierName.toLowerCase();
            const imageUrl = dot.metadata?.image || dot.metadata?.animation_url || "";

            return (
              <Link
                key={`${dot.contractAddress}-${dot.tokenId}`}
                href={`/medal/${tierSlug}`}
                className={styles.card}
              >
                <div className={styles.cardImage}>
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={`${tierName} #${dot.tokenId}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                  <span className={styles.sourceBadge}>{dot.source || "Original"}</span>
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.tierName}>{tierName}</span>
                  <span className={styles.tokenId}>#{dot.tokenId?.toString()}</span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No Medals Forged Yet</p>
            <p className={styles.emptyText}>
              Begin your investment journey by forging your first Medal of Honor.
            </p>
            <Link href="/TheForge" className={styles.forgeCta}>
              Enter The Forge
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedalGrid;
