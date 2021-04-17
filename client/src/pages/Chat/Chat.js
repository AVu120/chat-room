import React, { useState, useEffect, useContext, useRef } from "react";
import { TextField, Button, makeStyles } from "@material-ui/core";
import Header from "../../components/Header/Header";
import Footer from "../../components/common/Footer";
import { logOut } from "../../helpers/auth";
import styles from "./Chat.module.css";
import ErrorMessage from "../../components/common/PopUpMessage";
import { UserStatusContext } from "../../App";
import socketIOClient from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
    display: "flex",
    flexGrow: 1,
    padding: "16px 0",
  },
  draftMessageInputField: {
    margin: "10px 0",
    width: "90vw",
    // height: "5vh",
  },
}));

/* I know this file is very messy and excessively large, I should abstract everything out into separate files
   to reduce this file's size and increase readability/maintainability. 
   I'm just too lazy right now, maybe later. */
const Chat = ({ isAuthenticated }) => {
  const classes = useStyles();
  const { userStatus, setUserStatus } = useContext(UserStatusContext);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [readStatus, setReadStatus] = useState(null);
  const [writeError, setWriteError] = useState(null);
  const [otherError, setOtherError] = useState(null);
  const [screenDimensions, setScreenDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const messagesEndRef = useRef(null);

  const resizeScreen = () => {
    setScreenDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  };

  const sendMessage = async () => {
    // Check if message has content and isn't just spaces & newline characters.
    if (draftMessage && draftMessage.trim().replace(/[\r\n]+/gm, "")) {
      readStatus && setReadStatus(null);
      writeError && setWriteError(null);
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_API_URL}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: draftMessage.trim(),
              timestamp: Date.now(),
              uid: userStatus?.userId,
              displayName: userStatus.displayName || userStatus.email,
            }),
          }
        );
        if (!response.ok) {
          const errorResponse = await response.json();
          setWriteError(errorResponse.code);
          setUserStatus((userStatus) => ({
            ...userStatus,
            showNotification: true,
            notificationSeverity: "error",
            notificationText: errorResponse.code.includes("PERMISSION_DENIED")
              ? "You have been logged out, please log in again before sending another message."
              : errorResponse.code,
          }));
        }
        setIsLoading(false);
        setDraftMessage("");
      } catch (error) {
        console.error(error);
        setWriteError(error);
      }
    } else setDraftMessage("");
  };

  const changeDraftMessage = (event) => {
    setWriteError(null);
    setDraftMessage(event.target.value);
  };

  const acknowledgeErrorMessage = () => setOtherError(null);

  // Read messages from Google Firebase Realtime Database
  useEffect(() => {
    const readMessages = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/messages`
      );
      const retrievedMessages = await response.json();
      if (retrievedMessages?.length) setMessages(retrievedMessages);
      else {
        setMessages([]);
        setReadStatus("There are no messages yet!");
      }
    };
    userStatus?.isAllowedToUseChatroom && readMessages();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!messages.length) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    window.addEventListener("resize", resizeScreen);

    return () => window.removeEventListener("resize", resizeScreen);
  });

  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_BASE_API_URL);

    socket.on("sendMessage", (newMessage) => {
      setMessages((prevMessages) => {
        const numberOfPrevMessages = prevMessages.length;
        let lastMessage, isDuplicateMessage;
        if (numberOfPrevMessages) {
          lastMessage = prevMessages[prevMessages.length - 1];
          isDuplicateMessage =
            lastMessage.uid === newMessage.uid &&
            lastMessage.timestamp === newMessage.timestamp;
        }

        return numberOfPrevMessages === 0 || !isDuplicateMessage
          ? [...prevMessages, newMessage]
          : prevMessages;
      });
    });

    socket.on("updateUserStatus", (updatedUserStatus) => {
      setUserStatus((userStatus) => ({ ...userStatus, updatedUserStatus }));
    });

    socket.on("serverError", (serverError) => {
      alert(serverError);
    });

    return () => socket.disconnect();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles.chat}>
      <Header
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        isAuthenticated={isAuthenticated}
        logOut={() => logOut(setUserStatus, setOtherError)}
        setError={setOtherError}
      />
      <section
        className={
          userStatus?.isAllowedToUseChatroom
            ? styles.midSection
            : styles.midSection__unverifiedAccess
        }
      >
        {userStatus?.isAllowedToUseChatroom ? (
          <>
            <div
              className={styles.messages}
              style={{ height: `${screenDimensions.height - 244}px` }}
            >
              {messages.map((message, i) => {
                const prevMessageSenderId = messages[i - 1]?.uid;
                const prevMessageSenderDisplayName =
                  messages[i - 1]?.displayName;
                const senderId = message?.uid;
                const senderDisplayName = message?.displayName || message?.uid;
                const timestamp = new Date(message.timestamp);
                return (
                  <div
                    className={styles.messageContainer}
                    key={`${senderId}'s message sent at ${message.timestamp}.`}
                  >
                    {
                      // If the message is sent by another user.
                      userStatus?.userId !== senderId &&
                        // The sender didn't send the previous message OR
                        // they changed display names between sending this message and
                        // the previous message.
                        (prevMessageSenderId !== senderId ||
                          (prevMessageSenderId === senderId &&
                            senderDisplayName !==
                              prevMessageSenderDisplayName)) && (
                          <p className={styles.message_senderId}>
                            {senderDisplayName}
                          </p>
                        )
                    }
                    <div
                      // Position your messages on right-side and all other messages on left.
                      className={`${styles.message}  ${
                        // If message is sent by current user, position on right-side and style differently.
                        userStatus?.userId === senderId
                          ? styles.message__yours
                          : ""
                      }`}
                    >
                      <div className={styles.message_content}>
                        {message.content}
                        <p className={styles.time_stamp}>
                          {`${
                            timestamp.getHours() > 12
                              ? timestamp.getHours() - 12
                              : timestamp.getHours()
                          }:${
                            timestamp.getMinutes() < 10 ? "0" : ""
                          }${timestamp.getMinutes()} ${
                            timestamp.getHours() > 11 ? "pm" : "am"
                          }\u00A0\u00A0\u00A0${timestamp.getDate()}/${
                            timestamp.getMonth() + 1
                          }/${timestamp.getFullYear()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            {readStatus && !messages.length && (
              <div className={styles.readStatus}>{readStatus}</div>
            )}

            <div className={styles.form}>
              <TextField
                onChange={changeDraftMessage}
                value={draftMessage}
                className={classes.draftMessageInputField}
                variant="outlined"
                multiline={true}
                helperText={writeError}
                error={Boolean(writeError)}
                placeholder="Type your message here."
                onKeyPress={(e) => {
                  if ((e.key === "Enter") & !e.shiftKey) sendMessage();
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={() => sendMessage()}
                disabled={!draftMessage || isLoading}
              >
                Send
              </Button>
            </div>
          </>
        ) : (
          <div
            className={styles.verifyEmailMessage}
            style={{ height: `${screenDimensions.height - 125}px` }}
          >
            <p className={styles.verifyEmailMessage_sentence}>
              {`A request to verify your email address has been emailed to ${userStatus?.email}.`}
            </p>
            {/* <p className={styles.verifyEmailMessage_sentence}>
              Please check your email inbox.
            </p> */}
            <p className={styles.verifyEmailMessage_sentence}>
              After you have verified your email, click{" "}
              <a href="/login">here</a> to enter the chatroom.
            </p>
            <p className={styles.verifyEmailMessage_sentence}>
              Please do not click the above link too frequently as Google
              Firebase may disable app access from your device due to unusually
              frequent activity.
            </p>
          </div>
        )}
      </section>
      <Footer />
      <ErrorMessage
        title="Error"
        message={otherError}
        open={Boolean(otherError)}
        handleClose={acknowledgeErrorMessage}
      />
    </div>
  );
};

export default Chat;
