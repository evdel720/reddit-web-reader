const requestPosts = () => {
  // start with checking if there's subscriptions
  $.ajax({
    type: "GET",
    url: `${REDDIT}/subreddits/mine/subscriber`,
    crossDomain: true,
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', `bearer ${window.sessionStorage.access_token}`);
    },
    success: subscriptionSuccess,
    error: showError
  });
};

const subscriptionSuccess = (resp) => {
  // if there's lists, make multi
  // if there's no list, get the front page
  if (resp.data.children.length) {
    buildOrUpdateMulti(resp.data.children);
  } else {
    // request all posts
  }
  window.list = resp;
};

const buildOrUpdateMulti = (list) => {
  $.ajax({
    type: "PUT",
    url: `${REDDIT}/api/multi/reddit_web_reader/${window.sessionStorage.username}`,
    crossDomain: true,
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', `bearer ${window.sessionStorage.access_token}`);
    },
    data: {
      model: {
        description_md: "Reddit Web Reader's multi",
        display_name: "reddit_web_reader",
        icon_name: 'None',
        key_color: '#000000',
        subreddits: list.map((l) => {
          return { name: l.data.title };
        }),
        visibility: `hidden`,
        weighting_scheme: `classic`
      },
      multipath: "reddit_web_reader"
    },
    success: multiSuccess,
    error: showError
  });
};

const multiSuccess = (resp) => {
  window.multi = resp;
  console.log(resp);
};
