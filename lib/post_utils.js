
const requestPosts = () => {
  $.ajax({
    type: "GET",
    url: `${REDDIT}/${sessionStorage.getItem('section')}`,
    crossDomain: true,
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', `bearer ${sessionStorage.getItem('access_token')}`);
    },
    data: { limit: 25, after: sessionStorage.getItem('last'), show: 'all' },
    success: renderPosts,
    error: showError
  });
};

const renderPosts = (resp) => {
  window.list = resp;
  sessionStorage.setItem('last', resp.data.after);
  let ul = document.querySelector('ul');
  let loading = $('#loading');
  loading.addClass('hidden');
  resp.data.children.forEach((child) => {
    let li = post(child.data);
    ul.appendChild(li);
  });
  let win = $(window);
  win.scroll(() => {
    if (loading.hasClass('hidden') && $(document).height() - win.height() === win.scrollTop()) {
			loading.removeClass('hidden');
      requestPosts();
		}
  });
  win.on("touchmove", () => {
    if (loading.hasClass('hidden') && $(document).height() - win.height() <= window.scrollY + 10) {
			loading.removeClass('hidden');
      requestPosts();
		}
  });
};

const appendChildrenTo = (parent, children) => {
  children.forEach((el) => {
    parent.appendChild(el);
  });
};

const votes = (data) => {
  let div = document.createElement('div');
  let up = document.createElement('p');
  let down = document.createElement('p');
  let count = document.createElement('h4');
  count.innerText = data.ups;
  up.innerText = "▲";
  down.innerText = "▼";
  up.addEventListener('click', () => vote('t3_' + data.id, 1));
  down.addEventListener('click', () => vote('t3_' + data.id, -1));
  div.classList.add('votes');
  appendChildrenTo(div, [up, count, down]);
  return div;
};

const left = (data) => {
  let div = document.createElement('div');
  let thumbnail = document.createElement('img');
  div.classList.add('left');
  thumbnail.src = ['self', 'default', "nsfw"].includes(data.thumbnail) ? DEFAULT_IMG : data.thumbnail;
  appendChildrenTo(div, [votes(data), thumbnail]);
  return div;
};

const below = (data) => {
  let div = document.createElement('div');
  let info = document.createElement('h3');
  let numOfComments = document.createElement('h5');
  numOfComments.innerText = data.num_comments;
  info.innerHTML = `by <i>${data.author}</i> in <i>${data.subreddit}</i>`;
  numOfComments.addEventListener('click', () => {
    window.location = `https://www.reddit.com/${data.permalink}`;
  });
  appendChildrenTo(div, [numOfComments, info]);
  div.classList.add('below');
  return div;
};

const post = (data) => {
  let li = document.createElement('li');
  let title = document.createElement('h2');
  let right = document.createElement('div');
  right.classList.add('right');
  appendChildrenTo(right, [title, below(data)]);
  title.innerText = data.title;
  title.addEventListener('click', () => {
    window.location = data.url;
  });
  appendChildrenTo(li, [left(data), right]);
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
  sessionStorage.removeItem('last');
  document.querySelector('ul').innerHTML = "";
  requestPosts();
};
