/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import SearchFilter from "../../Components/Card/SearchFilter";
import Nav from "../../Components/Header/Nav";
import Table from "../../Components/Table/Table";
import Handlers from "../../Services/Toolkit/Handlers";
import { Tooltip } from "antd";
import APIErrorView from "../../Components/Error/APIErrorView";
import { ToastContainer } from "react-toastify";

const Messages = () => {
  const {
    dashboardData,
    messageTableData,
    fetchDashboardData,
    fetchMessageData,
    itemsPerPage,
    currentPage,
    showDashboard,
    totalItems,
    totalPages,
    searchText,
    handleSearchTextChange,
    handleSearchSubmit,
    fetchMessageFolderData,
    folderData,
    selectFolderView,
  } = Handlers();

  useEffect(() => {
    if (!dashboardData?.user_name || !dashboardData?.user_mail) {
      fetchDashboardData();
    }
    fetchMessageFolderData();
  }, []);

  useEffect(() => {
    if (folderData.length > 0 && selectFolderView) {
      fetchMessageData(1, itemsPerPage);
    }
  }, [folderData, selectFolderView]);

  const columns = [
    { header: "Sender Name", accessor: (row) => row.sender_name },
    // { header: "Sender Email", accessor: (row) => row.sender_mail },
    { header: "Subject", accessor: (row) => row.subject },
    {
      header: "Date",
      accessor: (row) => new Date(row.received_datetime).toLocaleString(),
    },
  ];

  const primaryKeys = ["sender_name", "sender_mail", "subject"];
  const columnsAll =
    messageTableData.length > 0
      ? [
          ...primaryKeys,
          ...Object.keys(messageTableData[0]).filter(
            (key) => !primaryKeys.includes(key)
          ),
        ].map((key) => ({
          header: key
            .replaceAll("_", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          accessor: (row) => {
            const value = row[key];
            if (key === "sender_name" || key === "subject") {
              const words = value?.split(" ") || [];
              const limit = key === "subject" ? 6 : 12;
              const display =
                words.length > limit
                  ? words.slice(0, limit).join(" ") + "..."
                  : value;
              return (
                <Tooltip title={value}>
                  <span>{display}</span>
                </Tooltip>
              );
            }
            if (key.includes("datetime"))
              return new Date(value).toLocaleString();
            if (typeof value === "boolean") return value ? "Yes" : "No";
            return value;
          },
        }))
      : [];

  return (
    <>
      <Nav />
      <div className="relative object-cover w-full h-screen mt-[9rem] bg-[#f2f2f2]">
        <SearchFilter
          pageTitle="Messages"
          filterView={false}
          searchText={searchText}
          attachmentView={false}
          searchView={true}
          onSearchChange={handleSearchTextChange}
          onSearchSubmit={handleSearchSubmit}
        />
        <Table
          tableTitle="Messages Table"
          columns={columns}
          data={messageTableData?.previews || []}
          folderView={true}
          totalPages={messageTableData?.totalPages || 0}
          totalItems={messageTableData?.totalItems || 0}
        />
      </div>
    </>
  );
};

export default Messages;
