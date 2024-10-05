import React, { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { getUserProfile, fetchUserNotifications, markNotificationAsRead } from '../../../firebase/services';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Style from "./Notification.module.css";

const Notification = () => {
  const walletAddress = useAddress();
  const [user, setUser] = useState(null);
  const [userNotifications, setUserNotifications] = useState([]);
  const [showCount, setShowCount] = useState(5); // Show 5 notifications initially

  useEffect(() => {
    const fetchUserData = async () => {
      if (walletAddress) {
        const userData = await getUserProfile(walletAddress);
        setUser(userData);
      }
    };

    fetchUserData();
  }, [walletAddress]);

  const [isNavbarDocked, setIsNavbarDocked] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavbarDocked(window.scrollY < 100);
    };
    handleScroll(); // needed to invoke docked function again for notification menu
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        const notifications = await fetchUserNotifications(user.walletAddress);
        setUserNotifications(notifications);
      }
    };

    if (user) {
      fetchNotifications();
    } else {
      setUserNotifications([]);
    }
  }, [user]);

  const handleNotificationClick = async (notificationId) => {
    await markNotificationAsRead(notificationId);
    setUserNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleDeleteNotification = async (notificationId) => {
    setUserNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== notificationId)
    );
  };

  const unreadNotifications = userNotifications.filter(
    (notification) => !notification.read
  );

 
  const handleShowMore = () => {
    setShowCount((prevCount) => prevCount + 5); 
  };

  return (
    <div
      className={`${Style.notification} ${
      isNavbarDocked ? "" : Style.notificationUndocked
      }`}
    >
      <div className={Style.notification_box}>
        <div className={Style.notification_box_img}>
          <div className={Style.notification_img_wrapper}>
            {user && (
              <img
                src={user.profilePictureUrl}
                className={Style.notification_img_wrapper_img}
                alt="User Profile"
                width={50}
                height={50}
              />
            )}
          </div>
        </div>
        <div className={Style.notification_box_info}>
          {user ? (
            <>
              <h4>{user.username}</h4>
            </>
          ) : (
            <p>Please log in to view notifications.</p>
          )}
        </div>
        <span className={Style.notification_box_new}></span>
      </div>

      {unreadNotifications.length > 0 && (
        <div className={Style.notification_list}>
    
          {unreadNotifications.slice(0, showCount).map((notification) => (
            <div key={notification.id} className={Style.notification_item}>
              <p>
                -{notification.Message}
                </p>
                <span onClick={() => handleNotificationClick(notification.id)}>
                  <FontAwesomeIcon icon={faTrash} className={Style.trashIcon} />
                </span>
              
            </div>
          ))}
        </div>
      )}

      
      {unreadNotifications.length > showCount && (
        <button className={Style.showMoreButton} onClick={handleShowMore}>
          Show More
        </button>
      )}
    </div>
  );
};

export default Notification;
