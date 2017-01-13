/* global requestLogin */
/* global getAccessCode */
/* global requestPosts */
/* global setRefreshTimeout */

document.addEventListener('DOMContentLoaded', () => {
  let connect = document.getElementById('connect');
  if (window.sessionStorage.username) {
    connect.classList.add('hidden');
    requestPosts();
    let refreshIn = window.sessionStorage.expiration_time - new Date().getTime() - 600;
    setRefreshTimeout(refreshIn);
  } else {
    connect.addEventListener('click', requestLogin);
    let url = new URL(window.location.href);
    if (url.search !== '' && !url.searchParams.get('error')) {
      getAccessCode(url.searchParams);
    }
  }
});
