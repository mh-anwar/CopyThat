'use-strict';
let mode_checkbox = document.getElementById('mode_checkbox');
let autotype_checkbox = document.getElementById('autotype_checkbox');
let toolbar_height_slider = document.getElementById('toolbar_height');
let toolbar_height_value_output = document.getElementById(
  'toolbar_height_value'
);

//Set document theme/mode automatically
function set_mode(event) {
  if (event.target.checked) {
    set_dark_mode_var();
    chrome.storage.sync.set({ mode: 'dark' });
  } else {
    set_light_mode_var();
    chrome.storage.sync.set({ mode: 'light' });
  }
}

//Set root CSS variables for dark mode
function set_dark_mode_var() {
  let root = document.querySelector(':root');
  root.style.setProperty('--back', '#000509');
  root.style.setProperty('--fore', '#0d1117');
  root.style.setProperty('--color', '#c2cad2');
}

//Set root CSS variables for light mode
function set_light_mode_var() {
  let root = document.querySelector(':root');
  root.style.setProperty('--back', 'aliceblue');
  root.style.setProperty('--fore', 'rgb(172, 169, 169)');
  root.style.setProperty('--color', 'black');
}

function set_toolbar_height() {
  //Sync toolbar height to storage and update HTML
  let toolbar_height_slider = document.getElementById('toolbar_height');
  let toolbar_height_value_output = document.getElementById(
    'toolbar_height_value'
  );
  chrome.storage.sync.set({ toolbar_height: toolbar_height_slider.value });
  toolbar_height_value_output.innerHTML = toolbar_height_slider.value + '% ';
}

function set_autotype(event) {
  if (event.target.checked) {
    chrome.storage.sync.set({ autotype: true });
  } else {
    chrome.storage.sync.set({ autotype: false });
  }
}

function open_tab(event) {
  /*In theory there is only one active-tab
  and only one active link*/
  active_tab = document.getElementsByClassName('active-tab');
  for (let i = 0; i < active_tab.length; i++) {
    active_tab[i].classList.remove('active-tab');
  }

  nav_links = document.getElementsByClassName('nav-active-link');
  for (let i = 0; i < nav_links.length; i++) {
    nav_links[i].classList.remove('nav-active-link');
  }

  let tab_name = event.target.innerText.toLowerCase() + '_tab';
  document.getElementById(tab_name).classList.add('active-tab');
  event.target.classList.add('nav-active-link');
}

//Attach event listeners
mode_checkbox.addEventListener('change', set_mode);
autotype_checkbox.addEventListener('change', set_autotype);
toolbar_height.addEventListener('input', set_toolbar_height);

//Synchronize page mode and mode checkbox state
chrome.storage.sync.get('mode', function (data) {
  if (data.mode == 'dark') {
    set_dark_mode_var();
    document.getElementById('mode_checkbox').setAttribute('checked', true);
  }
});

//Synchronize toolbar height to range slider
chrome.storage.sync.get('toolbar_height', function (data) {
  toolbar_height_slider.value = data.toolbar_height;
  toolbar_height_value_output.innerHTML = data.toolbar_height + '% ';
});

//Synchronize autotype state to autotype checkbox
chrome.storage.sync.get('autotype', function (data) {
  if (data.autotype === true) {
    document.getElementById('autotype_checkbox').setAttribute('checked', true);
  }
});

//Allow page to open when navigation links are clicked
let nav_links = document.getElementsByClassName('nav-links');
for (let i = 0; i < nav_links.length; i++) {
  //Only assign tab to buttons that aren't linked to webpage
  if (!nav_links[i].href) {
    nav_links[i].addEventListener('click', open_tab);
  }
}
