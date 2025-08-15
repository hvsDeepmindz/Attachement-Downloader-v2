import axios from "axios";

export const AttachmentTableData = async (
  file,
  duplicate,
  currentPage,
  itemsPerPage,
  emailLike = ""
) => {
  try {
    const response = await axios.get(
      `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/attachment/table-data?target_file=${file}&duplicate=${duplicate}&current_page=${currentPage}&item_per_page=${itemsPerPage}${
        emailLike ? `&email_like=${emailLike}` : ""
      }`,
      {
        headers: {
          accept: "application/json",
        },
        withCredentials: true,
      }
    );
    return response?.data || [];
  } catch (error) {
    console.error("AttachmentTableData API error:", error);
    return [];
  }
};

export const FolderBasedAttachmentData = async (
  folderid,
  pageSize = 10,
  pageNo = 1
) => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${
      import.meta.env.VITE_REACT_APP_BASE_URL
    }/attachment/all?attachment_folder_id=${folderid}&page_size=${pageSize}&page_num=${pageNo}`,
    headers: {
      accept: "application/json",
    },
    withCredentials: true,
  };

  return axios
    .request(config)
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      console.log(error);
      return [];
    });
};

export const DownloadAttachments = async (attachmentIds) => {
  const data = JSON.stringify(
    Array.isArray(attachmentIds) ? attachmentIds : [attachmentIds]
  );

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_REACT_APP_BASE_URL}/attachment/download`,
    headers: {
      accept: "application/octet-stream",
      "Content-Type": "application/json",
    },
    data,
    responseType: "blob",
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);

    // Get filename from Content-Disposition header (if provided)
    let fileName =
      Array.isArray(attachmentIds) && attachmentIds.length > 1
        ? "attachments.zip"
        : "downloaded_file";
    const disposition = response.headers["content-disposition"];
    if (disposition && disposition.includes("filename=")) {
      fileName = decodeURIComponent(
        disposition.split("filename=")[1].replace(/"/g, "")
      );
    }

    return { blob: response.data, fileName };
  } catch (error) {
    console.error("Download error", error);
    return null;
  }
};

export const DownloadAllAttachments = async (filename) => {
  const config = {
    method: "get",
    url: `${
      import.meta.env.VITE_REACT_APP_BASE_URL
    }/attachment/download-all?target_file=${filename}`,
    headers: {
      Accept: "application/zip",
    },
    responseType: "blob",
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return new Blob([response.data], { type: "application/zip" });
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
};

export const ExcelDownload = async (attachmentId) => {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_REACT_APP_BASE_URL}/attachment/parse-resume`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    data: JSON.stringify(attachmentId),
    responseType: "blob",
  };

  try {
    const response = await axios.request(config);
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidates.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
