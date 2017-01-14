const setDefaultSection = () => {
  if (!window.sessionStorage.section) {
    window.sessionStorage.section = "hot";
  }
};

const setSectionChangeHandlers = () => {
  let links = Array.from(document.querySelector('ol').children);
  links.forEach((link) => {
    link.addEventListener('click', changeSectionTo);
  });
};

const changeSectionTo = (e) => {
  window.sessionStorage.section = e.target.id;
  document.querySelector('ul').innerHTML = "";
  requestPosts();
};
