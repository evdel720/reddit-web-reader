
document.addEventListener('DOMContentLoaded', () => {
  let connect = document.getElementById('connect');
  let section = document.querySelector('ol');
  let edit = document.getElementById('edit');

  // to edit subreddits, takes user to the edit page
  edit.addEventListener('click', (e) => {
    e.preventDefault();
    window.location = 'https://www.reddit.com/subreddits/';
  });

  let expirationTime = Number(sessionStorage.getItem('expiration_time'));
  setSectionChangeHandlers();

  // whenever page refreshes, the last should be initialized
  sessionStorage.removeItem('last');

  if (!sessionStorage.getItem('section')) {
    // setup the default section
    sessionStorage.setItem('section', "hot");
  }

  if (expirationTime &&
    expirationTime < new Date().getTime()) {
    // if the token is already expired but still in storage,
    // clear sessionStorage
    sessionStorage.clear();
  }

  if (sessionStorage.getItem('access_token')) {
    showInterface(connect, section, edit);
    requestPosts();
    // setup requesting refresh token (since it expires in 60 mins from the initial access request)
    // it refreshed before 5 minutes
    let refreshIn = expirationTime - new Date().getTime() - 300000;
    setRefreshTimeout(refreshIn);
  } else {
    connect.addEventListener('click', requestLogin);
    let url = new URL(window.location.href);
    if (url.search !== '' && !url.searchParams.get('error')) {
      showInterface(connect, section, edit);
      getAccessCode(url.searchParams);
    }
  }
});
