/* global snoowrap */

const CLIENT_ID = 'M3TmaJXp3-rYAQ';
const CLIENT_SECRET = 'VuNhTvMUcR8-2fC5zY36FFGOGE8';
const USER_AGENT = 'Reddit Reader';
const REDIRECT_URI = 'http://localhost:3000';

let requester;

const requestLogin = (e) => {
  e.stopPropagation();
  e.preventDefault();
  let name = e.target.user.value;
  let pass = e.target.password.value;
  var authenticationUrl = snoowrap.getAuthUrl({
    clientId: CLIENT_ID,
    scope: ['identity', 'mysubreddits', 'read', 'save', 'subscribe', 'vote'],
    redirectUri: REDIRECT_URI,
    permanent: true,
    state: '3da9bef8db6e63104d3dsfsa'
  });
  // https://www.reddit.com/api/v1/authorize?client_id=M3TmaJXp3-rYAQ&response_type=code&state=3da9bef8db6e63104d3dsfsa&redirect_uri=http%3A%2F%2Flocalhost%3A3000&duration=permanent&scope=identity+mysubreddits+read+save+subscribe+vote
  window.location = authenticationUrl;
};

const showUser = () => {
  requester.getMe().then(user => {
    document.querySelector('header').innerText = `Logged in as ${user.name}`;
  });
};

const showPosts = () => {
  let ul = document.querySelector('ul');
  requester.getHot().then(list => {
    list.forEach((post) => {
      let li = document.createElement('li');
      li.innerText = post.title;
      li.addEventListener('click', () => {
        window.location = post.url;
      });
      ul.appendChild(li);
    });
  });
};

const setRequesterSuccess = (r) => {
  window.r = r;
  requester = r;
  document.getElementById('login').classList.add('hidden');
  showUser();
  showPosts();
};

const setRequesterFail = (er) => {
  document.getElementById('error').classList.remove('hidden');
};

const setReqester = (code) => {
  snoowrap.fromAuthCode({
    code: code,
    userAgent: USER_AGENT,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI
  }).then(setRequesterSuccess, setRequesterFail);
};

document.addEventListener('DOMContentLoaded', () => {
  let loginForm = document.getElementById('login');
  loginForm.addEventListener('submit', requestLogin);
  var code = new URL(window.location.href).searchParams.get('code');
  if (requester === undefined && code) { setReqester(code); }

});
