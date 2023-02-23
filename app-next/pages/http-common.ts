import axios from "axios";

const http = axios.create({
  baseURL: "https://ipfs.infura.io:5001",
  headers: {
    "Content-type": "application/json",
  },
});

export default http;