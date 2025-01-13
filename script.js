function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

var currentYear = new Date().getFullYear();
document.getElementById("copyright").innerHTML = 'Copyright &#169; ' + currentYear + ' Fakhri Rasyids. All Rights Reserved.';

const project = [
  {
    title: "Traffic Sense",
    technology: "Kotlin",
    image: "./assets/porto/trafficsense_placeholder.png",
    github: "https://github.com/fakhrirasyids/TrafficSense",
    liveDemo: "https://www.dropbox.com/scl/fi/8vhlsx7p85bll5ry2bzk4/TrafficSenseLast.apk?rlkey=cypout5bva3hi4ruxbj3kppdo&dl=0",
  },
  {
    title: "Ndoro Kojo",
    technology: "Kotlin",
    image: "./assets/porto/ndorokojo_placeholder.png",
    github: "https://github.com/fakhrirasyids/ndorokojo-android",
    liveDemo: "https://www.dropbox.com/scl/fi/ke7scutt5o16sqj9n1mku/Ndoro-Kojo.apk?rlkey=bswlgxgp8ionntdxrdvenoajx&dl=0",
  },
  {
    title: "Jukee",
    technology: "Java",
    image: "./assets/porto/jukee_placeholder.png",
    github: "https://github.com/fakhrirasyids/Jukee",
    liveDemo: "https://www.dropbox.com/scl/fi/wegvgbrnahrc7okx449fd/Jukee.apk?rlkey=qsp2v3o8uqmnle5vmqt7rble5&dl=0",
  },
  {
    title: "My Heavy Equipment",
    technology: "Kotlin",
    image: "./assets/porto/mhe_placeholder.png",
    github: "https://github.com/fakhrirasyids/myheavyequipment",
    liveDemo: "https://drive.google.com/file/d/1nvrDuX-IJOzaznyqsqmoZ9cs9Tp8Isom/view?usp=sharing",
  },
  {
    title: "Beataco",
    technology: "Desktop Java Swing",
    image: "./assets/porto/beataco_placeholder.png",
    github: "https://github.com/fakhrirasyids/BeatacoBot-Swing",
    liveDemo: null,
  },
  {
    title: "Berita.In",
    technology: "Kotlin + Clean Architecture + Modularity",
    image: "./assets/porto/beritain_placeholder.png",
    github: "https://github.com/fakhrirasyids/Berita.In-App",
    liveDemo: null,
  },
  {
    title: "Aromaloka",
    technology: "Kotlin Slicing",
    image: "./assets/porto/aromaloka_placeholder.png",
    github: "https://github.com/fakhrirasyids/Aromaloka",
    liveDemo: "https://www.dropbox.com/scl/fi/3xvwbvrcwyw03hkktfxao/Aromaloka.apk?rlkey=wx4bigpzbqlop3f4wgt9i3sd0&dl=0",
  },
  {
    title: "Diabetless",
    technology: "Kotlin Slicing",
    image: "./assets/porto/diabetless_placeholder.png",
    github: "https://github.com/fakhrirasyids/diabetless",
    liveDemo: "https://www.dropbox.com/scl/fi/hr6er7obhp630p5lpfz3c/Diabetless.apk?rlkey=9xfoh07svz10de85qiwges650&dl=0",
  },
  {
    title: "Painthings",
    technology: "Kotlin Slicing",
    image: "./assets/porto/painthing_placeholder.png",
    github: "https://github.com/fakhrirasyids/Painthings",
    liveDemo: "https://www.dropbox.com/scl/fi/a5whsipluftg3ee26hkya/Painthings.apk?rlkey=p3bnz5zkct4wnebt06lue8t9s&dl=0",
  },
  {
    title: "Cinta Beauty App",
    technology: "Java Slicing",
    image: "./assets/porto/cba_placeholder.png",
    github: "https://github.com/fakhrirasyids/CintaBeautyApp",
    liveDemo: "https://www.dropbox.com/scl/fi/njip2fa2260v74w54wq9o/CintaBeautyApp.apk?rlkey=maxi7j51se2kv64203ow4zrzw&dl=0",
  },
  {
    title: "PicDF",
    technology: "Kotlin Jetpack Compose",
    image: "./assets/porto/picdf_placeholder.png",
    github: "https://github.com/fakhrirasyids/PicDF-AndroidCompose",
    liveDemo: null,
  },
  {
    title: "Capstone App",
    technology: "Kotlin Slicing",
    image: "./assets/porto/capstone_placeholder.png",
    github: "https://github.com/fakhrirasyids/capstoneapp",
    liveDemo: "https://www.dropbox.com/scl/fi/vl85vrzxyi5fb2wbn9s23/CapstoneApp.apk?rlkey=ju24bdv06rdr9ttv69730b3t6&dl=0",
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button[id^="filter"]');
  const projects = document.querySelectorAll('.details-container');
  const projectsContainer = document.querySelector('.experience-details-container');

  const noProjectsMessage = document.createElement('p');
  noProjectsMessage.textContent = `Project in progress :)`;
  noProjectsMessage.style.textAlign = 'center';
  noProjectsMessage.style.fontSize = '1.5em';
  noProjectsMessage.style.color = '#666';
  noProjectsMessage.style.marginTop = '0px';
  noProjectsMessage.style.display = 'none'; 
  projectsContainer.appendChild(noProjectsMessage);

  buttons.forEach((btn) => btn.classList.remove('active'));
  buttons[0].classList.add('active');
  filterProjects('all');
 
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.id.replace('filter-', '');

      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      filterProjects(filter);
    });
  });

  function filterProjects(category) {
    let hasVisibleProjects = false;

    projects.forEach((project) => {
      const projectCategory = project.getAttribute('data-category');
      if (category === 'all' || projectCategory === category) {
        project.style.display = 'block';
        hasVisibleProjects = true;
      } else {
        project.style.display = 'none';
      }
    });

    if (hasVisibleProjects) {
      noProjectsMessage.style.display = 'none';
    } else {
      noProjectsMessage.style.display = 'block';
    }
  }
});
