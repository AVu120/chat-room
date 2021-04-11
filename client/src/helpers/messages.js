export const readMessages = async () => {
  const response = await fetch(
    `${process.env.REACT_APP_BASE_API_URL}/messages`
  );
  if (response.ok) console.log({ success: response });
  else console.log({ error: response });
};
