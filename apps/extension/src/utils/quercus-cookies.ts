export async function getQuercusCookieHeader(): Promise<string> {
  return new Promise((resolve) => {
    chrome.cookies.getAll({ domain: "q.utoronto.ca" }, (cookies) => {
      const str = cookies
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
      resolve(str);
    });
  });
}