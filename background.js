let popupOpen = false;

chrome.action.onClicked.addListener((tab) => {
  popupOpen = !popupOpen;
  if (popupOpen) {
    chrome.action.setPopup({ popup: "popup.html" });
  } else {
    chrome.action.setPopup({ popup: "" });
  }
});
