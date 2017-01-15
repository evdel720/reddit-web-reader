
const requestPosts = () => {
  $.ajax({
    type: "GET",
    url: `${REDDIT}/${sessionStorage.getItem('section')}`,
    crossDomain: true,
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', `bearer ${sessionStorage.getItem('access_token')}`);
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
  thumbnail.src = ['self', 'default', "nsfw"].includes(data.thumbnail) ? DEFAULT_IMG : data.thumbnail;
  numOfComments.addEventListener('click', () => {
    window.location = `https://www.reddit.com/${data.permalink}`;
  });
  title.addEventListener('click', () => {
    window.location = data.url;
  });
  appendChildrenTo(li, [upVotes, thumbnail, right]);
  return li;
};

const setSectionChangeHandlers = () => {
  let links = Array.from(document.querySelector('ol').children);
  links.forEach((link) => {
    link.addEventListener('click', changeSectionTo);
  });
};

const changeSectionTo = (e) => {
  sessionStorage.setItem('section', e.target.id);
  document.querySelector('ul').innerHTML = "";
  requestPosts();
};
