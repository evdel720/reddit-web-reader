/* global requestLogin */
/* global getAccessCode */
/* global requestPosts */
/* global setRefreshTimeout */

document.addEventListener('DOMContentLoaded', () => {
  let connect = document.getElementById('connect');
  let scroll = document.getElementById('scroll');
  if (window.sessionStorage.expiration_time < new Date().getTime()) {
    window.sessionStorage.clear();
  }
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
