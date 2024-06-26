import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Avatar from "boring-avatars";
import User from "@/components/user";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Profile({ onClick }) {
  const [userData, setUserData] = useState("");
  const user = getCookie("userData");
  const userCookie = getCookie("userData");
  const router = useRouter();

  useEffect(() => {
    if (!userCookie) {
      router.push("/signIn");
    } else {
      router.push("/profile");
    }
  }, [userCookie]);

  useEffect(() => {
    fetch(`/api/${user}`)
      .then((res) => res.json())
      .then((data) => setUserData(data.data));
  }, [user]);

  const calculateAverageRating = () => {
    if (userData && userData.ratingGames) {
      const sum = userData.ratingGames.reduce(
        (acc, currentValue) => acc + currentValue,
        0
      );
      const average = sum / userData.ratingGames.length;
      return average.toFixed(1);
    }
    return 0;
  };

  const getRatingColorClass = (rating) => {
    if (rating >= 7) {
      return styles.goodRating;
    } else if (rating >= 4 && rating < 6.9) {
      return styles.middleRating;
    } else {
      return styles.badRating;
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapperProfile}>
        {userData && (
          <div className={styles.container}>
            <div className={styles.containerDetails}>
              <h2 className={styles.title}>
                {userData.name} {userData.surname}
              </h2>
              <h3> {userData.username}</h3>
              <p>
                Sono di: <strong>{userData.location}</strong>
              </p>
              <p>
                Mi piace praticare: <strong>{userData.sports}</strong>
              </p>
              <Link href="/editProfile" className={styles.button}>
                Modifica Profilo
              </Link>
            </div>

            <div className={styles.containerImage}>
              <Avatar
                size={150}
                name={userData.username}
                variant="beam"
                colors={["#9ff7aa", "#216869", "#f4f6f5"]}
              />
            </div>
          </div>
        )}
        <div className={styles.containerRating}>
          <h2 className={styles.titleRating}>Il tuo Rating</h2>
          <p className={styles.paragraphRating}>
            Qui c&apos;è la media dei voti ricevuti durante i tuoi match
          </p>
          <h4>Fair Play 🤝 - Abilità 💪 - Puntualità 🕙</h4>
          <label
            className={`${styles.rating} ${getRatingColorClass(
              calculateAverageRating()
            )}`}
          >
            {calculateAverageRating()}
          </label>
        </div>
        <h3>I tuoi amici: </h3>
        <div className={styles.preferiti}>
          {userData &&
            userData.friends &&
            userData.friends.map((friend, index) => (
              <User key={index} name={friend} onClick={onClick} />
            ))}
        </div>
      </div>
    </div>
  );
}
