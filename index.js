
$().ready(() => {
  const expirationTime = Number(sessionStorage.getItem('expiration_time'));
  setUpInitialSection();
  checkExpired(expirationTime);
  checkLoggedIn(expirationTime);
});

const setUpInitialSection = () => {
  sessionStorage.removeItem('last');
  if (!sessionStorage.getItem('section')) {
    // setup the default section
    sessionStorage.setItem('section', "hot");
  }
};

const checkExpired = (expTime) => {
  if (expTime &&
    expTime < new Date().getTime()) {
    // if the token is already expired but still in storage,
    // clear sessionStorage
    sessionStorage.clear();
  }
};

const checkLoggedIn = (expTime) => {
  const connect = $("#connect");
  if (sessionStorage.getItem('access_token')) {
    setUpInterface(connect);
    requestAccountInfo();
    // setup requesting refresh token (since it expires in 60 mins from the initial access request)
    // it refreshed before 5 minutes
    const refreshIn = expTime - new Date().getTime() - 300000;
    window.setTimeout(requestRefresh, refreshIn);
  } else {
    connect.click(requestLogin);
    let url = new URL(window.location.href);
    if (url.search !== '' && !url.searchParams.get('error')) {
      getAccessCode(url.searchParams);
    }
  }
};

const changeSectionTo = (e) => {
  sessionStorage.setItem('sectionType', e.target.classList[0]);
  sessionStorage.setItem('section', e.target.id);
  sessionStorage.removeItem('last');
  $('ul').empty();
  requestPosts();
};

const setUpInterface = (connect) => {
  $('ol').children().click(changeSectionTo);
  connect.addClass('hidden');
  $("ol").removeClass('hidden');
  const edit = $("#edit");
  edit.removeClass('hidden');
  edit.click((e) => {
    e.preventDefault();
    window.location = 'https://www.reddit.com/subreddits/';
  });
};
