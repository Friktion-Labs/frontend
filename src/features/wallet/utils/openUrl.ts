export const openUrl = (url: string) => {
  const a = document.createElement("a");
  a.style.position = "absolute";
  a.style.top = "-1000px";
  a.style.left = "-1000px";
  a.href = url;
  // a.target = "_blank";
  // a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
