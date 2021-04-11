import React, { useState, useEffect, useContext } from "react";
import { TextField, Button, makeStyles } from "@material-ui/core";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { db } from "../../services/firebase";
import { logOut } from "../../helpers/auth";
// import { readMessages } from "../../helpers/messages";
import styles from "./Chat.module.css";
import ErrorMessage from "../../components/common/PopUpMessage";
import { UserStatusContext } from "../../App";

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
  },
}));

const Chat = ({ authenticated }) => {
  const classes = useStyles();
  const [userStatus, setUserStatus] = useContext(UserStatusContext);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [readError, setReadError] = useState(null);
  const [writeError, setWriteError] = useState(null);
  const [otherError, setOtherError] = useState(null);
  const [displayName, setDisplayName] = useState(
    userStatus?.displayName || userStatus?.email
  );
  const [screenDimensions, setScreenDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const resizeScreen = () => {
    setScreenDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
    });
  };

  async function onSendMessage() {
    // Check if message has content and isn't just spaces & newline characters.
    if (draftMessage && draftMessage.trim().replace(/[\r\n]+/gm, "")) {
      readError && setReadError(null);
      writeError && setWriteError(null);
      setIsLoading(true);
      try {
        await db.ref("messages").push({
          content: draftMessage.trim(),
          timestamp: Date.now(),
          uid: userStatus.userId,
          displayName,
        });
        setIsLoading(false);
        setDraftMessage("");
      } catch (error) {
        console.error(error);
        setWriteError(error.message);
      }
    } else setDraftMessage("");
  }

  const onDraftMessageChange = (event) => {
    setWriteError(null);
    setDraftMessage(event.target.value);
  };

  const acknowledgeErrorMessage = () => setOtherError(null);

  useEffect(() => {
    // setReadError(null);
    // // Read messages from Google Realtime Database
    const readMessages = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/messages`
      );
      const retrievedMessages = await response.json();
      if (retrievedMessages?.length) setMessages(retrievedMessages);
      else {
        setMessages([]);
        setReadError("There are no messages yet!");
      }
    };

    // return () => db.ref("messages").off("value", listener);
    readMessages();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resizeScreen);

    return () => window.removeEventListener("resize", resizeScreen);
  });

  return (
    <div className={styles.chat}>
      <Header
        userStatus={userStatus}
        setUserStatus={setUserStatus}
        setDisplayName={setDisplayName}
        authenticated={authenticated}
        logOut={() => logOut(setUserStatus, setOtherError)}
        setError={setOtherError}
      />
      <section
        className={
          userStatus.isVerifiedToUseChatroom
            ? styles.midSection
            : styles.midSection__unverifiedAccess
        }
      >
        {userStatus.isVerifiedToUseChatroom ? (
          <>
            <div
              className={styles.messages}
              style={{ height: `${screenDimensions.height - 240}px` }}
            >
              {messages.map((message, i) => {
                const prevMessageSenderId = messages[i - 1]?.uid;
                const prevMessageSenderDisplayName =
                  messages[i - 1]?.displayName;
                const senderId = message?.uid;
                const senderDisplayName = message?.displayName || message?.uid;
                return (
                  <div
                    className={styles.messageContainer}
                    key={`${senderId}'s message sent at ${message.timestamp}.`}
                  >
                    {
                      // If the message is sent by another user.
                      userStatus.userId !== senderId &&
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
                        userStatus.userId === senderId
                          ? styles.message__yours
                          : ""
                      }`}
                    >
                      <p className={styles.message_content}>
                        {message.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {readError && !messages.length && <div>{readError}</div>}

            <div className={styles.form}>
              <TextField
                onChange={onDraftMessageChange}
                value={draftMessage}
                className={classes.draftMessageInputField}
                variant="outlined"
                multiline={true}
                helperText={writeError}
                error={Boolean(writeError)}
                placeholder="Type your message here then click send."
                onKeyPress={(e) => {
                  if ((e.key === "Enter") & !e.shiftKey) onSendMessage();
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                // endIcon={<SendIcon />}
                className={classes.button}
                onClick={() => onSendMessage()}
                disabled={!draftMessage || isLoading}
              >
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.verifyEmailMessage}>
            <p className={styles.verifyEmailMessage_sentence}>
              {`A request to verify your email address has been emailed to ${userStatus.email}.`}
            </p>
            <p className={styles.verifyEmailMessage_sentence}>
              Please check your email inbox.
            </p>
            <p className={styles.verifyEmailMessage_sentence}>
              After you have verified your email, click <a href="/chat">here</a>{" "}
              and you will automatically log in and enter the chatroom.
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
