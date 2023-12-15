function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

var currentYear = new Date().getFullYear();
document.getElementById("copyright").innerHTML = 'Copyright &#169; ' + currentYear + ' Fakhri Rasyids. All Rights Reserved.';
