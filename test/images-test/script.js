import Stanchion from 'stanchion';

// Displays image on DOM
function displayImage(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.width = 200;
    img.height = 200;
    img.onload = () => {return resolve(img)};
    img.onerror = reject;
    img.src = imageSrc;
    document.body.appendChild(img);
  });
}

function main() {
  // Change the silly name
  const network = Stanchion.initialize({logger: console.log});
  const images = [
    'http://localhost:3000/static/images-test/1.jpg',
    'http://localhost:3000/static/images-test/2.jpg',
    'http://localhost:3000/static/images-test/3.jpg',
    'http://localhost:3000/static/images-test/4.jpg',
    'http://localhost:3000/static/images-test/5.jpg',
    'http://localhost:3000/static/images-test/6.jpg',
    'http://localhost:3000/static/images-test/7.jpg',
    'http://localhost:3000/static/images-test/8.jpg',
    'http://localhost:3000/static/images-test/9.jpg',
    'http://localhost:3000/static/images-test/10.jpg',
    'http://localhost:3000/static/images-test/11.jpg',
    'http://localhost:3000/static/images-test/12.png',
    'http://localhost:3000/static/images-test/13.png',
    'http://localhost:3000/static/images-test/14.jpg',
    'http://localhost:3000/static/images-test/15.jpg',
    'http://localhost:3000/static/images-test/16.jpg',
    'http://localhost:3000/static/images-test/17.png'
  ];
  for (let i = 0; i < images.length; i++) {
    const task = () => {return displayImage(images[i])}
    const onError = (error) => {console.log(error.message)};
    const priority = i;
    network.queue({task, onError, priority, url: images[i]});
  }
}

window.setTimeout(main, 2000);
