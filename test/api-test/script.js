import axios from 'axios';
import Stanchion from 'stanchion';

function main() {
  const network = Stanchion.initialize({logger: console.log});
  const outputDiv = document.createElement('div');
  document.body.appendChild(outputDiv);

  const requestNumber = 17;
  for (let i = 0; i < requestNumber; i++) {
    const task = () => {
      return axios.get('/echo', {
        params: {
            message: `Call ${i}`
        }
      });
    };
    const onSuccess = (response) => {outputDiv.innerHTML += (response.data.message + '<br />')}
    const onError = (error) => {outputDiv.innerHTML += error.message};
    const priority = i;
    network.queue({task, onSuccess, onError, priority});
  }
}

window.setTimeout(main, 2000);
