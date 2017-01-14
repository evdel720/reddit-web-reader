/* global requestLogin */
/* global getAccessCode */
/* global requestPosts */
/* global setRefreshTimeout */
/* global setDefaultSection */
/* global clearStorageIfTokenIsExpired */

document.addEventListener('DOMContentLoaded', () => {
  console.log(window.sessionStorage);
  let connect = document.getElementById('connect');
  let scroll = document.getElementById('scroll');
  setDefaultSection();
  clearStorageIfTokenIsExpired();
  setSectionChangeHandlers();
  if (window.sessionStorage.username) {
    connect.classList.add('hidden');
    scroll.classList.remove('hidden');
    requestPosts();
    let refreshIn = Number(window.sessionStorage.expiration_time) - new Date().getTime() - 600000;
    setRefreshTimeout(refreshIn);
  } else {
    connect.addEventListener('click', requestLogin);
    let url = new URL(window.location.href);
    if (url.search !== '' && !url.searchParams.get('error')) {
      connect.classList.add('hidden');
      scroll.classList.remove('hidden');
      getAccessCode(url.searchParams);
    }
  }
});
