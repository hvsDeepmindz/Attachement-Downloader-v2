import axios from "axios";

export const MoveToFolderData = async (targetFolderId, attachmentIds) => {
  const data = JSON.stringify(
    Array.isArray(attachmentIds) ? attachmentIds : [attachmentIds]
  );

  const config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${
      import.meta.env.VITE_REACT_APP_BASE_URL
    }/attachment/move-to?target_folder_id=${targetFolderId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    data,
  };

  try {
    const response = await axios.request(config);
    return response?.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
