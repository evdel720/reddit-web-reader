
const requestPosts = () => {
  $.ajax({
    type: "GET",
    url: `${REDDIT}/hot`,
    crossDomain: true,
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', `bearer ${window.sessionStorage.access_token}`);
    },
    success: renderPosts,
    error: showError
  });
};

const renderPosts = (resp) => {
  window.list = resp;
  let ul = document.querySelector('ul');
  resp.data.children.forEach((child) => {
    let li = post(child.data);
    ul.appendChild(li);
  });
};

const appendChildrenTo = (parent, children) => {
  children.forEach((el) => {
    parent.appendChild(el);
  });
};

const post = (data) => {
  let li = document.createElement('li');
  let upVotes = document.createElement('h4');
  let thumbnail = document.createElement('img');
  let title = document.createElement('h2');
  let info = document.createElement('h3');
  let numOfComments = document.createElement('h5');
  let below = document.createElement('div');
  let right = document.createElement('div');
  below.classList.add('below');
  right.classList.add('right');
  appendChildrenTo(below, [numOfComments, info]);
  appendChildrenTo(right, [title, below]);
  numOfComments.innerText = data.num_comments;
  info.innerHTML = `by <i>${data.author}</i> in <i>${data.subreddit}</i>`;
  title.innerText = data.title;
  upVotes.innerText = data.ups;
  thumbnail.src = data.thumbnail === 'self' ? DEFAULT_IMG : data.thumbnail;
  numOfComments.addEventListener('click', () => {
    window.location = `https://www.reddit.com/${data.permalink}`;
  });
  title.addEventListener('click', () => {
    window.location = data.url;
  });
  appendChildrenTo(li, [upVotes, thumbnail, right]);
  return li;
};

// build multi to show posts
// const subscriptionSuccess = (resp) => {
//   // if there's lists, make multi
//   // if there's no list, get the front page
//   if (resp.data.children.length) {
//     buildOrUpdateMulti(resp.data.children);
//   } else {
//     // request all posts
//   }
//   window.list = resp;
// };
//
// const buildOrUpdateMulti = (list) => {
//   let multipath = `user/${window.sessionStorage.username}/m/reddit_web_reader`;
//   $.ajax({
//     type: "PUT",
//     url: `${REDDIT}/api/multi/${multipath}`,
//     crossDomain: true,
//     beforeSend: (xhr) => {
//       xhr.setRequestHeader('Authorization', `bearer ${window.sessionStorage.access_token}`);
//     },
//     data: {
//       model: JSON.stringify({
//         description_md: "Reddit Web Reader's multi",
//         display_name: "reddit_web_reader",
//         icon_name: '',
//         key_color: '#000000',
//         subreddits: list.map((l) => {
//           return { name: l.data.display_name };
//         }),
//         visibility: `hidden`,
//         weighting_scheme: `classic`
//       }),
//       multipath: multipath
//     },
//     success: multiSuccess,
//     error: showError
//   });
// };
//
// const multiSuccess = (resp) => {
//   window.multi = resp;
//   console.log(resp);
// };
