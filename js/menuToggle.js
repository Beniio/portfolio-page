const toggleMenu = () => {
  document
    .getElementById('primaryNav')
    .classList.toggle('open');
};
let bttn = document.getElementById('hamburgerBtn');
bttn.onclick = toggleMenu;
