/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Handlers from "../../Services/Toolkit/Handlers";
import { LuLoader, LuLoaderCircle } from "react-icons/lu";
import MessageFolderData from "../../Services/Data/MessageFolderData";
import { Tooltip } from "antd";

const Table = ({
  tableTitle,
  columns,
  data,
  attachmentView = false,
  folderView = false,
  totalPages,
  totalItems,
}) => {
  const {
    currentPage,
    itemsPerPage,
    startIndex,
    endIndex,
    paginatedData,
    handlePageChange,
    updateTableData,
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

  return (
    <div
      title={tableTitle}
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
            className={`absolute top-[-1rem] left-[1rem] z-20 rounded-full px-[1rem] py-[1rem] 
            bg-[#9476d1]`}
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
                        className="cursor-pointer w-6 h-6"
                      />
                    </th>
                  )}

                  <th
                    className={`${
                      attachmentView === true ? "left-[5rem]" : "left-0"
                    } sticky z-10 bg-[#765EA5] text-white px-[2rem] py-[1.5rem] text-left text-[1.6rem] font-[600]`}
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
                  <tr>
                    <td
                      colSpan={columns.length + (attachmentView ? 2 : 1)}
                      className="py-[4rem] px-[4rem] text-center"
                    >
                      <LuLoaderCircle
                        size={30}
                        className="animate-spin text-[#765EA5] mx-auto"
                      />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {rows.length > 0 ? (
                    rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`${
                          rowIndex % 2 === 0 ? "bg-[#E4E2F2]" : "bg-white"
                        } border-t border-[#e5e5e5] hover:opacity-[0.8] transition-all duration-[0.2s] ease-in-out cursor-grab`}
                      >
                        {attachmentView && (
                          <td
                            className={`sticky left-0 ${
                              rowIndex % 2 === 0 ? "bg-[#E4E2F2]" : "bg-white"
                            } px-[2rem] py-[1.5rem] text-[1.6rem] font-medium text-[#333333]`}
                          >
                            <input
                              type="checkbox"
                              checked={
                                selectedAttachmentIds.includes(row.id)
                              }
                              onChange={() => toggleAttachmentSelect(row.id)}
                              className="cursor-pointer w-6 h-6"
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
                          const accessorOutput = column.accessor(row);
                          const isElement =
                            React.isValidElement(accessorOutput);

                          return (
                            <td
                              key={colIndex}
                              className="px-[2rem] py-[1rem] text-[1.6rem] font-medium text-[#333333]"
                            >
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
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length + (attachmentView ? 2 : 1)}
                        className="px-[2rem] py-[1.5rem] text-center text-[1.6rem] text-[#666666]"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-end max-md:flex-col gap-[2rem] items-center py-[1rem] mt-[2rem]">
        <div className="item-per-page flex items-center gap-[1rem]">
          <label className="text-[1.6rem] text-[#444444]">Rows:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="border border-[#cccccc] px-[1rem] py-[0.5rem] rounded-md text-[1.4rem] text-[#333333] outline-none cursor-pointer"
          >
            {perPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="text-[1.6rem] text-black font-normal">
            {startIndex + 1} - {Math.min(endIndex, totalItems)}{" "}
            <span className="text-[grey]">Out of {totalItems}</span>
          </span>
        </div>
        <div className="flex items-center gap-[0.2rem]">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-[1rem] py-[0.5rem] text-[1.4rem] ${
              currentPage === 1
                ? "cursor-not-allowed text-[#a3a0a0]"
                : "cursor-pointer text-[#623AA2]"
            } bg-white border-[#d2d2d2] rounded-full mr-[0.5rem]`}
          >
            <i className="fa-solid fa-chevron-left" />
          </button>
          <div className="overflow-x-auto flex no-scrollbar grow-0 shrink-0 max-w-[200px] mr-[1rem]">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-[1.2rem] py-[0.5rem] text-[1.4rem] border-[1px] ${
                  currentPage === page
                    ? "bg-[#6B46C1] text-white border-transparent"
                    : "text-[#666666] bg-white border-[#d2d2d2]"
                } mx-[0.5rem] rounded-full cursor-pointer`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-[1rem] py-[0.5rem] text-[1.4rem] ${
              currentPage === totalPages
                ? "cursor-not-allowed text-[#a3a0a0]"
                : "cursor-pointer text-[#623AA2]"
            } bg-white border-[#d2d2d2] rounded-full mr-[0.5rem]`}
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
