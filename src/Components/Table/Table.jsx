/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Handlers from "../../Services/Toolkit/Handlers";
import MessageFolderData from "../../Services/Data/MessageFolderData";
import { motion } from "framer-motion";
import { Empty, Pagination, Tooltip } from "antd";

const Table = ({
  tableTitle,
  columns,
  data,
  attachmentView = false,
  folderView = false,
  totalPages = 0,
  totalItems = 0,
  tooltipShow,
}) => {
  const {
    showDashboard,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    selectedAttachmentIds,
    downloadedExcelIds,
    toggleSelectAllAttachmentRows,
    toggleAttachmentSelect,
    isLoading,
    selectFolderView,
    handleSelectFolderView,
    dashboardData,
    folderData,
  } = Handlers();

  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const rows = Array.isArray(data) ? data : [];
  const perPageOptions = [10, 15, 20, 25, 30, 35, 40, 45, 50];
  const startIndex = Math.max(0, (currentPage - 1) * itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems || 0);

  return (
    <div
      className={`px-[10rem] pb-[1rem] relative w-full rounded-xl max-xl:px-[5rem] max-md:px-[2rem]`}
    >
      <div className={`flex items-center gap-[2rem] w-full h-auto relative`}>
        {folderView === true ? (
          <div
            className={`rounded-xl bg-white flex flex-col gap-[0rem] overflow-hidden transition-all duration-500 ease-in-out ${
              isFolderOpen ? "w-[480px]" : "w-0"
            } h-[600px] max-md:h-[500px] overflow-y-auto no-scrollbar shadow-md`}
          >
            {isFolderOpen && (
              <>
                <div className="px-[2rem] py-[1.5rem] sticky top-0 z-10 bg-[#765EA5] text-white flex items-center justify-between">
                  <Tooltip
                    title={
                      <div style={{ color: "#000" }}>
                        {dashboardData?.user_mail}
                      </div>
                    }
                    color="#fff"
                    overlayInnerStyle={{ color: "#000", background: "#fff" }}
                  >
                    <h2 className="text-[1.6rem] font-[600] line-clamp-1 cursor-pointer">
                      <i className="fa-solid fa-user-tie text-[1.8rem]" />
                      &nbsp; {dashboardData?.user_name}
                    </h2>
                  </Tooltip>
                  <i
                    className={`fa-solid fa-angles-left text-white text-[1.6rem] cursor-pointer`}
                    onClick={() => setIsFolderOpen(!isFolderOpen)}
                  />
                </div>
                <div className="flex flex-col w-auto">
                  {folderData.map((ele) => (
                    <div
                      key={ele?.id}
                      onClick={() => handleSelectFolderView(ele?.displayName)}
                      className={`border-b border-[#d2d2d2] px-[2rem] py-[1rem] cursor-pointer flex justify-between items-center hover:bg-[#e4e2f2] ${
                        selectFolderView === ele?.displayName
                          ? "bg-[#e4e2f2]"
                          : "bg-white"
                      }`}
                    >
                      <Tooltip
                        title={
                          <div style={{ color: "#000" }}>
                            {ele?.displayName}
                          </div>
                        }
                        color="#fff"
                        overlayInnerStyle={{
                          color: "#000",
                          background: "#fff",
                        }}
                      >
                        <h2 className="text-[1.6rem] text-[#414141] font-[600] line-clamp-1 cursor-pointer">
                          {selectFolderView === ele?.displayName ? (
                            <i className="fa-solid fa-circle-check text-[green] text-[1.8rem]" />
                          ) : (
                            <i className="fa-solid fa-folder-open text-[grey] text-[1.8rem]" />
                          )}
                          &nbsp; {ele?.displayName}
                        </h2>
                      </Tooltip>
                      <h2 className="text-[1.6rem] text-[#414141] font-[600] cursor-pointer">
                        {ele?.totalItemCount}
                      </h2>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null}
        {!isFolderOpen ? (
          <div
            className={`absolute top-[-1rem] left-[1rem] z-20 rounded-full px-[1rem] py-[1rem] bg-[#9476d1]`}
          >
            {!isFolderOpen && (
              <i
                className="fa-solid fa-angles-right text-[1.8rem] text-white cursor-pointer"
                onClick={() => setIsFolderOpen(true)}
              />
            )}
          </div>
        ) : null}
        <div className="overflow-x-auto no-scrollbar rounded-xl w-full">
          <div className="h-[600px] max-md:h-[500px] overflow-y-auto no-scrollbar">
            <table className="w-full border-collapse rounded-xl shadow-md whitespace-nowrap">
              <thead className="sticky top-0 z-10 bg-[#765EA5] text-white">
                <tr>
                  {attachmentView && (
                    <th className="px-[2rem] py-[1.5rem] text-left text-[1.6rem] font-[600] sticky left-0 z-10 bg-[#765EA5]">
                      <input
                        type="checkbox"
                        checked={
                          selectedAttachmentIds.length ===
                            (Array.isArray(data)
                              ? data
                              : data?.table_data || []
                            ).length &&
                          (Array.isArray(data) ? data : data?.table_data || [])
                            .length > 0
                        }
                        onChange={() =>
                          toggleSelectAllAttachmentRows(
                            Array.isArray(data) ? data : data?.table_data || []
                          )
                        }
                        className={`${
                          showDashboard
                            ? "cursor-pointer"
                            : "cursor-not-allowed"
                        } w-8 h-8`}
                      />
                    </th>
                  )}
                  <th
                    className={`${
                      attachmentView === true ? "left-[5rem]" : "left-0"
                    } sticky z-10 bg-[#765EA5] text-white px-[2rem] py-[1.5rem] text-left text-[1.6rem] 
                    font-[600]`}
                  >
                    S. No.
                  </th>
                  {columns.map((column, index) => (
                    <th
                      key={index}
                      className="px-[2rem] py-[1.5rem] text-left text-[1.6rem] font-[600]"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  {[...Array(18)].map((_, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`${
                        index % 2 === 0 ? "bg-[#f9f9ff]" : "bg-white"
                      } border-t border-[#e5e5e5]`}
                    >
                      {Array.from({
                        length: columns.length + (attachmentView ? 2 : 1),
                      }).map((__, colIndex) => (
                        <td key={colIndex} className="px-[2rem] py-[1rem]">
                          <motion.div
                            initial={{ backgroundPosition: "-200% 0" }}
                            animate={{ backgroundPosition: "200% 0" }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="h-16 w-3/4 rounded-md bg-gradient-to-r from-[#e0e0e0] via-[#f0f0f0] to-[#e0e0e0] bg-[length:200%_100%]"
                          />
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  {rows.length > 0 ? (
                    rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`${
                          rowIndex % 2 === 0 ? "bg-[#E4E2F2]" : "bg-white"
                        } border-t border-[#e5e5e5] hover:opacity-[0.8] transition-all duration-[0.2s] ease-in-out cursor-pointer`}
                      >
                        {attachmentView && (
                          <td
                            className={`sticky left-0 ${
                              rowIndex % 2 === 0 ? "bg-[#E4E2F2]" : "bg-white"
                            } px-[2rem] py-[1.5rem] text-[1.6rem] font-medium text-[#333333]`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedAttachmentIds.includes(row.id)}
                              onChange={() => toggleAttachmentSelect(row.id)}
                              className="cursor-pointer w-8 h-8"
                            />
                          </td>
                        )}
                        <td
                          className={`${
                            attachmentView === true ? "left-[5rem]" : "left-0"
                          } sticky ${
                            rowIndex % 2 === 0 ? "bg-[#E4E2F2]" : "bg-white"
                          } px-[2rem] py-[1.5rem] text-[1.6rem] font-medium text-[#333333]`}
                        >
                          {startIndex + rowIndex + 1}.
                        </td>
                        {columns.map((column, colIndex) => {
                          let accessorOutput = column.accessor(row, rowIndex);

                          if (folderView && selectFolderView === "Drafts") {
                            if (
                              column.header === "Sender Name" &&
                              !row.sender_name
                            ) {
                              accessorOutput = (
                                <span className="text-[orangered] font-semibold">
                                  [Draft]
                                </span>
                              );
                            }
                            if (
                              column.header === "Sender Mail" &&
                              !row.sender_mail
                            ) {
                              accessorOutput = (
                                <span className="text-gray-500">
                                  (No subject)
                                </span>
                              );
                            }
                          }
                          const isElement =
                            React.isValidElement(accessorOutput);
                          return (
                            <td
                              key={colIndex}
                              className="px-[2rem] py-[1rem] text-[1.6rem] font-medium text-[#333333]"
                            >
                              {tooltipShow === true ? (
                                <Tooltip
                                  title={
                                    <div style={{ color: "#000" }}>
                                      {isElement ? "" : accessorOutput}
                                    </div>
                                  }
                                  color="#fff"
                                  overlayInnerStyle={{
                                    color: "#000",
                                    background: "#fff",
                                  }}
                                >
                                  <span>
                                    {isElement ? (
                                      accessorOutput
                                    ) : typeof accessorOutput === "string" &&
                                      column.header === "Attachment" ? (
                                      <a
                                        href={accessorOutput}
                                        className="text-blue-600 underline ml-2"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {accessorOutput.split("/").pop()}
                                      </a>
                                    ) : (
                                      accessorOutput
                                    )}
                                  </span>
                                </Tooltip>
                              ) : (
                                <span>
                                  {isElement ? (
                                    accessorOutput
                                  ) : typeof accessorOutput === "string" &&
                                    column.header === "Attachment" ? (
                                    <a
                                      href={accessorOutput}
                                      className="text-blue-600 underline ml-2"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {accessorOutput.split("/").pop()}
                                    </a>
                                  ) : (
                                    accessorOutput
                                  )}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length + (attachmentView ? 2 : 1)}
                        className="px-[2rem] py-[4rem] text-center text-[1.6rem] text-[#666666]"
                      >
                        <Empty />
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      {/* Pagination View */}
      <div className="flex justify-end max-md:flex-col gap-[2rem] items-center py-[1rem] mt-[2rem]">
        <div className="item-per-page flex items-center gap-[1rem]">
          <span className="text-[1.6rem] text-[#414141] font-normal">
            {totalItems > 0
              ? `${startIndex + 1} - ${Math.min(endIndex, totalItems)}`
              : "0 - 0"}
            <span className="text-[#414141]">
              &nbsp; Out of {totalItems || 0}
            </span>
          </span>
        </div>
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={itemsPerPage}
          showSizeChanger
          showQuickJumper
          pageSizeOptions={["10", "20", "50", "100"]}
          onChange={(page, pageSize) =>
            handlePageChange(
              page,
              attachmentView ? "attachment" : "message",
              attachmentView ? selectFolderView : null,
              pageSize
            )
          }
          onShowSizeChange={(page, pageSize) =>
            handleItemsPerPageChange(
              pageSize,
              attachmentView ? "attachment" : "message",
              attachmentView ? selectFolderView : null
            )
          }
          className="custom-pagination"
        />
      </div>
    </div>
  );
};

export default Table;
