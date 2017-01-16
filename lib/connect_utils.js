
const requestLogin = (e) => {
  let url = new URL(`https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&state=${STATE}&redirect_uri=${REDIRECT_URI}&duration=permanent&scope=identity+mysubreddits+read+save+subscribe+vote`);
  window.location = url;
};

const connectSuccess = (resp) => {
  // once the connection succeed,
  // set values to the sessionStorage
  // and redirect to origin (localhost:3000)
  // to avoid showing state and code in the whole time
  sessionStorage.setItem('access_token', resp.access_token);
  sessionStorage.setItem('refresh_token', resp.refresh_token);
  sessionStorage.setItem('expiration_time', new Date().getTime() + resp.expires_in * 1000);
  window.location = window.location.origin;
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
  // when error happens, show error and clear the sessionStorage
  // to enable user to try connecting again
  window.location = window.location.origin;
  $('#error').removeClass('hidden');
  sessionStorage.clear();
};

const refreshSuccess = (resp) => {
  // update session when refresh token
  sessionStorage.setItem('access_token', resp.access_token);
  sessionStorage.setItem('expiration_time', new Date().getTime() + resp.expires_in * 1000);
};

const requestRefresh = () => {
  $.ajax({
    type: "POST",
    url: 'https://ssl.reddit.com/api/v1/access_token',
    data: {
      grant_type: 'refresh_token',
      refresh_token: sessionStorage.getItem('refresh_token')
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
  // set timeout to request refresh token with proper time whenever page reloaded
  window.setTimeout(requestRefresh, time);
};

const showInterface = (connect, section, edit) => {
  connect.classList.add('hidden');
  section.classList.remove('hidden');
  edit.classList.remove('hidden');
};
