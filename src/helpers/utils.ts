export const delay = (timeout: number = 5000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};