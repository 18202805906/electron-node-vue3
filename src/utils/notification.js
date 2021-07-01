export default (msg) => {
  let title = '';
  return new window.Notification(title, {
    body: msg,
    tag: 'course-zip',
    icon: '/app.png'
  });
};
