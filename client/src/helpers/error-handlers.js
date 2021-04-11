export const createErrorMessage = ({ authService, error }) => {
  let errorMessage;
  if (
    error?.message.includes(
      "operation has been cancelled due to another conflicting popup being opened"
    )
  )
    errorMessage = `You're other login pop-up window has been closed. You can only have one open.`;
  else
    errorMessage =
      error?.message ||
      `Login with ${authService} failed. Please try again later.`;

  return errorMessage;
};
