const vote = (id, dir) => {
  $.ajax({
    type: "POST",
    url: `${REDDIT}/api/vote`,
    crossDomain: true,
    beforeSend: (xhr) => {
      xhr.setRequestHeader('Authorization', `bearer ${sessionStorage.getItem('access_token')}`);
    },
    data: { id: id, dir: dir },
    success: () => {
      // show some notification
      window.location.reload(true);
    },
    error: showError
  });
};
