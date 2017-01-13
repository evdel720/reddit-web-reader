const CLIENT_ID = 'QAI_kr3dQcnFSw';
const CLIENT_SECRET = 'u8TNMrvGTvgxfZ917Hk7AwKqbIQ';
const USER_AGENT = 'browser:reddit_reader:v0.1 (by /u/evdel720)';
const REDIRECT_URI = 'http://localhost:3000';

const requestLogin = (e) => {
  let url = new URL(`https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&state=3da9bef8db6e63104d3dsfsa&redirect_uri=${REDIRECT_URI}&duration=permanent&scope=identity+mysubreddits+read+save+subscribe+vote`);
  window.location = url;
};

const connectSuccess = (resp) => {

};

const connectFail = (err) => {

};

const getAccessCode = (searchParams) => {
  console.log(btoa(CLIENT_ID + ":" + CLIENT_SECRET));
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
          beforeSend: function(xhr){
            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(CLIENT_ID + ":" + CLIENT_SECRET));

          }
  });
  // let req = new XMLHttpRequest();
  // req.open('POST', 'https://www.reddit.com/api/v1/access_token');
  // req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  // req.setRequestHeader("Authorization", `user=${CLIENT_ID}&password=${CLIENT_SECRET}`);
  // let data = {
  //   grant_type: 'authorization_code',
  //   code: searchParams.get('code'),
  //   redirect_uri: REDIRECT_URI
  // };
  // req.send(data);
};

document.addEventListener('DOMContentLoaded', () => {
  let connect = document.getElementById('connect');
  connect.addEventListener('click', requestLogin);
  let url = new URL(window.location.href);
  if (url.search !== '' && !url.searchParams.get('error')) {
    getAccessCode(url.searchParams);
  }
});
