
const requestLogin = (e) => {
  let url = new URL(`https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&state=${STATE}&redirect_uri=${REDIRECT_URI}&duration=permanent&scope=identity+mysubreddits+read+save+subscribe+vote`);
  window.location = url;
};

const connectSuccess = (resp) => {
  window.sessionStorage.access_token = resp.access_token;
  window.sessionStorage.refresh_token = resp.refresh_token;
  window.sessionStorage.expiration_time = new Date().getTime() + resp.expires_in * 1000;
  requestPosts();
};

const getAccessCode = (searchParams) => {
  $.ajax({
    type: "POST",
    url: 'https://ssl.reddit.com/api/v1/access_token',
    data: {
      code: searchParams.get('code'),
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
      state: searchParams.get('state')
    },
    username: CLIENT_ID,
    password: CLIENT_SECRET,
    crossDomain: true,
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(CLIENT_ID + ":" + CLIENT_SECRET));
    },
    success: connectSuccess,
    error: showError
  });
};

const showError = (err) => {
  console.log(err);
};

const refreshSuccess = (resp) => {
  console.log('access_token refreshed');
  window.sessionStorage.access_token = resp.access_token;
  window.sessionStorage.expiration_time = new Date().getTime() + resp.expires_in * 1000;
};

const requestRefresh = () => {
  // request refresh with refresh token
  $.ajax({
    type: "POST",
    url: 'https://ssl.reddit.com/api/v1/access_token',
    data: {
      grant_type: 'refresh_token',
      refresh_token: window.sessionStorage.refresh_token
    },
    crossDomain: true,
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', 'Basic ' + btoa(CLIENT_ID + ":" + CLIENT_SECRET));
    },
    success: refreshSuccess,
    error: showError
  });
};

const setRefreshTimeout = (time) => {
  window.setTimeout(requestRefresh, time);
};
