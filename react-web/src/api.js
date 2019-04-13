import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8000/',
    // headers: {'ocp-apim-subscription-key': 'f277d5b4ecff4d33b1bea0dedc662f5a'}
});