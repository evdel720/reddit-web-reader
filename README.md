TODO
take care of vote success

# Reddit Web Reader

It is a single page app that enables users to navigate Reddit. I used JavaScript, HTML, CSS, jQuery, Serve and Reddit API.

## Setup

If you download this from Github, you need to setup Reddit developer register to run this app. Make a file in lib, secret_key.js and declare below.

CLIENT_ID
CLIENT_SECRET
REDIRECT_URI
STATE
REDDIT
DEFAULT_IMG

client id and secret would be in https://www.reddit.com/prefs/apps
redirect uri should be http://localhost:3000
state is just random string(good to be unique)
reddit is https://oauth.reddit.com
I used https://res.cloudinary.com/wkdal720/image/upload/v1484353630/default_wwyrhs.png for my default image.

If you got this from me as zip file, you don't need to do that step.

If you don't have serve package, type below in terminal.
$ npm install -g serve

Next, move to the folder and run the app in localhost by typing below in terminal.
$ serve

You can go to localhost:3000 and play with the app.

## Features & Implementation

### Reddit API

I used Reddit API to get all the data from the site. The app makes cross site requests to Reddit API using jQuery.

### OAuth2

Reddit uses OAuth2 to authorize requests. First the app takes user to Reddit authorization link and if user allows authorization, Reddit redirect user to the redirect_uri(that I set in preference page) with some code. With that code, I can get the access token by making another request with 'Authorization' in header. It actually sends two requests because it is cross domain requests(OPTION and the request, in here, POST). I implemented with beforeSend in jQuery for that part.
```javascript

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

```
### SessionStorage

When user refresh the page or visit another page, if I hold the access_token in my js files only, it goes away. I saved those necessary information (like access_token, refresh_token, expiration_time, section) in sessionStorage. Since it stores data with the origin url, when user refreshes or comes back from some other page, the access_token stays so user doesn't have to allow access many times. Since Reddit API's access_token expires in an hour, I need to refresh the token once the time gets closer, so I set the timeout for that. Whenever user loads the html file again, it calculate the time left from the expiration_time and sets timeout with proper time.

### Infinite Scroll

I also set last in sessionStorage to store the id of last post in the current page. When user first loads the page, I made sure it's not there. Once user loads posts, it stores the last post's id. When I make request posts api call to Reddit, I can add that id to get the next posts after that. When user scrolls to the end of the page, the app shows the loading image and requests more after the last post. I added two event listeners for that to make sure mobile support.

### Votes

I implemented voting feature and if it is done successfully, the app shows the success message shortly.

### mobile responsive design

I used media query to support mobile environment and jQuery event, touchmove to build mobile event control.

```css
@media only screen
  and (min-device-width: 375px)
  and (max-device-width: 667px)
  and (-webkit-min-device-pixel-ratio: 2)

```
