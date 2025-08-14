/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import Nav from "../../Components/Header/Nav";
import SearchFilter from "../../Components/Card/SearchFilter";
import Table from "../../Components/Table/Table";
import Handlers from "../../Services/Toolkit/Handlers";
import { AttachmentData } from "../../Services/Data/AttachmentData";
import { LuLoaderCircle } from "react-icons/lu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import APIErrorView from "../../Components/Error/APIErrorView";
import { Modal } from "antd";

const AttachmentView = () => {
  const { title: folderName } = useParams();
  const location = useLocation();

  const {
    showDashboard,
    attachmentTableData,
    fetchAttachmentData,
    handleDownloadAttachments,
    handleDownloadAllAttachments,
    downloadingAttachmentId,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    searchText,
    handleSearchTextChange,
    handleSearchSubmit,
    isAttachmentPreviewOpen,
    previewAttachment,
    handleOpenAttachmentPreview,
    handleCloseAttachmentPreview,
    attachmentFolderData,
    fetchAttachmentFolderData,
  } = Handlers();

  useEffect(() => {
    if (!attachmentFolderData || attachmentFolderData.length === 0) {
      fetchAttachmentFolderData();
    }
  }, []);

  useEffect(() => {
    if (folderName && attachmentFolderData.length > 0) {
      fetchAttachmentData(
        decodeURIComponent(folderName),
        currentPage,
        itemsPerPage
      );
    }
  }, [attachmentFolderData, folderName, currentPage, itemsPerPage]);

  const renderModalContent = () => {
    if (!previewAttachment) return null;
    const fileUrl = `${
      import.meta.env.BASE_URL
    }/attachments/${encodeURIComponent(previewAttachment.name)}`;

    const ext = previewAttachment.name.split(".").pop().toLowerCase();

    return (
      <div>
        <h3 className="mb-2 font-semibold">{previewAttachment.name}</h3>
        <p className="mb-4 text-gray-500 text-sm">
          Size: {(previewAttachment.size / 1024).toFixed(2)} KB
          {previewAttachment.last_modified &&
            ` • Modified: ${new Date(
              previewAttachment.last_modified
            ).toLocaleString()}`}
        </p>

        {ext === "pdf" ? (
          <iframe
            src={fileUrl}
            width="100%"
            height="600"
            style={{ border: 0 }}
          />
        ) : ["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(ext) ? (
          <img
            src={fileUrl}
            alt={previewAttachment.name}
            className="w-full h-auto object-contain"
          />
        ) : (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View or Download {previewAttachment.name}
          </a>
        )}
      </div>
    );
  };

  const columns = [
    {
      header: "Attachment",
      accessor: (row, index) => (
        <button
          onClick={() => handleOpenAttachmentPreview(row)}
          className={`flex items-center justify-start border px-[2rem] py-[0.3rem] rounded-full ${
            index % 2 === 0 ? "bg-[#E4E2F2]" : "bg-[#f1f1f1]"
          }`}
        >
          <img
            src={`${import.meta.env.BASE_URL}/Media/doc.png`}
            loading="lazy"
            className="w-[16px] h-[16px]"
          />
          &nbsp; {row.name}
        </button>
      ),
    },
    {
      header: "Download",
      accessor: (row, index) =>
        row.name ? (
          <div className="flex items-center gap-3">
            {downloadingAttachmentId === row.id ? (
              <div
                className={`border w-[30px] h-[30px] rounded-md flex justify-center items-center ${
                  index % 2 === 0 ? "bg-[#E4E2F2]" : "bg-white"
                }`}
              >
                <LuLoaderCircle className="animate-spin text-[1.8rem] text-[grey]" />
              </div>
            ) : (
              <img
                src={`${import.meta.env.BASE_URL}/Media/download.png`}
                loading="lazy"
                onClick={() => handleDownloadAttachments(row.id)}
                className={`cursor-pointer border w-[30px] h-[30px] px-[0.3rem] py-[0.1rem] rounded-md ${
                  index % 2 === 0 ? "bg-[#E4E2F2]" : "bg-white"
                }`}
              />
            )}
          </div>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <>
      <ToastContainer
        autoClose={2000}
        position="top-center"
        className={`custom-toast-container`}
      />
      <Nav />
      <div className="relative w-full h-screen mt-[9rem] bg-[#f2f2f2]">
        <SearchFilter
          pageTitle="Attachments"
          filterView={false}
          attachmentTitle={folderName}
          attachmentView={true}
          searchView={false}
          searchText={searchText}
          onSearchChange={handleSearchTextChange}
          onSearchSubmit={handleSearchSubmit}
          downloadAll={() =>
            handleDownloadAllAttachments(decodeURIComponent(folderName))
          }
          showUpload={(() => {
            const folder = attachmentFolderData.find(
              (f) => f.display_name?.toLowerCase() === "candidate resume"
            );
            return (
              folder && folder.display_name === decodeURIComponent(folderName)
            );
          })()}
        />
        <Modal
          open={isAttachmentPreviewOpen}
          onCancel={handleCloseAttachmentPreview}
          footer={null}
          width={800}
          centered
        >
          {renderModalContent()}
        </Modal>
        <Table
          tableTitle={`${folderName} Table`}
          columns={columns}
          data={attachmentTableData?.attachments || []}
          attachmentView={true}
          totalPages={attachmentTableData?.totalPages || 0}
          totalItems={attachmentTableData?.totalItems || 0}
          handlePageChange={(page) =>
            handlePageChange(page, "attachment", decodeURIComponent(folderName))
          }
          handleItemsPerPageChange={(val) =>
            handleItemsPerPageChange(
              val,
              "attachment",
              decodeURIComponent(folderName)
            )
          }
        />
      </div>
    </>
  );
};

export default AttachmentView;
