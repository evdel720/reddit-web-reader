/* global requestLogin */
/* global getAccessCode */
/* global requestPosts */
/* global setRefreshTimeout */
/* global setSectionChangeHandlers */

document.addEventListener('DOMContentLoaded', () => {
  let connect = document.getElementById('connect');
  let section = document.querySelector('ol');
  let expirationTime = Number(sessionStorage.getItem('expiration_time'));
  setSectionChangeHandlers();
  sessionStorage.removeItem('last');

  if (!sessionStorage.getItem('section')) { sessionStorage.setItem('section', "hot"); }

  if (expirationTime &&
    expirationTime < new Date().getTime()) {
    sessionStorage.clear();
  }

  if (sessionStorage.getItem('access_token')) {
    showInterface(connect, section);
    requestPosts();
    let refreshIn = expirationTime - new Date().getTime() - 600000;
    setRefreshTimeout(refreshIn);
  } else {
    connect.addEventListener('click', requestLogin);
    let url = new URL(window.location.href);
    if (url.search !== '' && !url.searchParams.get('error')) {
      showInterface(connect, section);
      getAccessCode(url.searchParams);
    }
  }
});
