import FormData from 'form-data';
import http from '../components/http-common';


const infuraProjectId = "2M5xY2I3ThsQ2NYzVzjLAlWRWR3";
const infuraProjectSecret = "f9b04aac3211725bfb552d1b2ff36a45";


const upload = (file: File, onUploadProgress: any): Promise<any> => {
  let formData = new FormData();
  formData.append("file", file);
  return http.post(
    "/api/v0/add",
    formData,
    {
      params: {
        'pin': 'false'
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      auth: {
        username: infuraProjectId,
        password: infuraProjectSecret
      },
      onUploadProgress,
    }
  );
};

const getFiles = (ipfsObjectHash: string): Promise<any> => {
  return http.post(
    "/api/v0/get",
    "",
    {
      params: {
        'arg': ipfsObjectHash,
        'archive': true
      },
      auth: {
        username: infuraProjectId,
        password: infuraProjectSecret
      }
    }
  );
};

const AvatarUploadService = {
  upload,
  getFiles
}

export default AvatarUploadService;