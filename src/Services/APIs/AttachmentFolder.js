import axios from "axios";

export const GetAllMessageFolder = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${
      import.meta.env.VITE_REACT_APP_BASE_URL
    }/message/folders`,
    headers: {
      accept: "application/json",
    },
  };

  return axios
    .request(config)
    .then((response) => {
      //   console.log(JSON.stringify(response.data));
      return response?.data;
    })
    .catch((error) => {
      console.log(error);
      return {};
    });
};
