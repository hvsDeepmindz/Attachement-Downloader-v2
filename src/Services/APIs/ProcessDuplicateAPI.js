import axios from "axios";

export const ProcessDuplicate = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${
      import.meta.env.VITE_REACT_APP_BASE_URL
    }/attachment/process-duplicate`,
    headers: {},
    withCredentials: true,
  };

  console.log(config);

  return axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response?.data;
    })
    .catch((error) => {
      console.log(error);
      return {};
    });
};
