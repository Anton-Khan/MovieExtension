const saveOptions = () => {
  const siteName = document.getElementById('siteName').value;
  const siteDomain = document.getElementById('siteDomain').value;
  
  chrome.storage.local.set(
    { siteName: siteName, siteDomain: siteDomain },
    () => {
      const status = document.getElementById('status');
      console.debug("oppa");
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  );
};

const restoreOptions = () => {
  chrome.storage.local.get(
    ["siteName", "siteDomain"],
    (items) => {
      document.getElementById('siteName').value = items.siteName;
      document.getElementById('siteDomain').value = items.siteDomain;
    }
  );
};
    
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);  
