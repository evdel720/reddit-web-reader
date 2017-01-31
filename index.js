
$().ready(() => {
  const expirationTime = Number(sessionStorage.getItem('expiration_time'));
  setUpInitialSection();
  checkExpired(expirationTime);
  checkLoggedIn(expirationTime);
  setUpNotification();
});

const setUpNotification = () => {
  const notification = sessionStorage.getItem('notification');
  if (notification) {
    const container = $('#notification').text(notification).removeClass('hidden');
    sessionStorage.removeItem('notification');
    window.setTimeout(() => {
      container.text("");
      container.addClass("hidden");
    }, 3000);
  }
};

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
  $(`#${sessionStorage.getItem('section')}`).removeClass('picked');
  sessionStorage.setItem('sectionType', e.target.classList[0]);
  sessionStorage.setItem('section', e.target.id);
  $(`#${sessionStorage.getItem('section')}`).addClass('picked');
  sessionStorage.removeItem('last');
  $('ul').empty();
  requestPosts();
};

const setUpInterface = (connect) => {
  const section = $('ol');
  section.children().not('.picked').click(changeSectionTo);
  section.removeClass('hidden');
  $('h1').addClass('hidden');
  connect.addClass('hidden');
  $(`#${sessionStorage.getItem('section')}`).addClass('picked');

  const edit = $("#edit");
  edit.removeClass('hidden');
  edit.click((e) => {
    e.preventDefault();
    window.location = 'https://www.reddit.com/subreddits/';
  });
};
