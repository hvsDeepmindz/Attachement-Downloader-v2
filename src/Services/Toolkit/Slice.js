/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import { AttachmentData } from "../Data/AttachmentData";

const getPersistedExcelIds = () => {
  const stored = localStorage.getItem("downloadedExcelIds");
  return stored ? JSON.parse(stored) : [];
};

const initialState = {
  isLoading: false,
  isGroupVisible: false,
  dashboardData: null,
  showDashboard: false,
  currentPage: 1,
  itemsPerPage: 10,
  messageTableData: { previews: [], totalPages: 0, totalItems: 0 },
  attachmentTableData: [],
  totalItems: 0,
  totalPages: 0,
  syncPendingItems: 0,
  searchText: "",
  historyStack: [],
  selectedAttachment: null,
  downloadingAttachmentId: null,
  selectedAttachmentIds: [],
  selectAllAttachments: false,
  isDownloadingLoad: false,
  isDownloadExcel: false,
  downloadedExcelIds: getPersistedExcelIds(),
  selectFolderView: "Inbox",
  isAttachmentPreviewOpen: false,
  previewAttachment: null,
  folderData: [],
  attachmentFolderData: [],
};

const Slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsGroupVisible: (state, action) => {
      state.isGroupVisible = action.payload;
    },
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    setShowDashboard: (state, action) => {
      state.showDashboard = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setMessageTableData: (state, action) => {
      const {
        previews = [],
        totalPages = 0,
        totalItems = previews.length,
      } = action.payload || {};
      state.messageTableData = { previews, totalPages, totalItems };
      state.totalItems = totalItems;
      state.totalPages = totalPages;
    },
    setAttachmentTableData: (state, action) => {
      const {
        attachments = [],
        totalPages = 0,
        totalItems = attachments.length,
      } = action.payload || {};
      state.attachmentTableData = attachments;
      state.totalItems = totalItems;
      state.totalPages = totalPages;
    },

    setSyncPendingItems: (state, action) => {
      state.syncPendingItems = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    pushToHistoryStack: (state, action) => {
      state.historyStack.push(action.payload);
    },
    popFromHistoryStack: (state) => {
      state.historyStack.pop();
    },
    setSelectedAttachment: (state, action) => {
      state.selectedAttachment = action.payload;
    },
    setDownloadingAttachmentId: (state, action) => {
      state.downloadingAttachmentId = action.payload;
    },
    toggleSelectAttachment: (state, action) => {
      const id = action.payload;
      if (state.selectedAttachmentIds.includes(id)) {
        state.selectedAttachmentIds = state.selectedAttachmentIds.filter(
          (x) => x !== id
        );
      } else {
        state.selectedAttachmentIds.push(id);
      }
    },
    toggleSelectAllAttachments: (state, action) => {
      const allIds = action.payload;
      if (
        state.selectedAttachmentIds.length === allIds.length &&
        allIds.length > 0
      ) {
        state.selectedAttachmentIds = [];
        state.selectAllAttachments = false;
      } else {
        state.selectedAttachmentIds = allIds;
        state.selectAllAttachments = true;
      }
    },
    resetSelectedAttachments: (state) => {
      state.selectedAttachmentIds = [];
      state.selectAllAttachments = false;
    },
    setIsDownloadingLoad: (state, action) => {
      state.isDownloadingLoad = action.payload;
    },
    setIsDownloadExcel: (state, action) => {
      state.isDownloadExcel = action.payload;
    },
    addDownloadedExcelIds: (state, action) => {
      const newIds = action.payload;
      const combined = Array.from(
        new Set([...state.downloadedExcelIds, ...newIds])
      );
      state.downloadedExcelIds = combined;
      localStorage.setItem("downloadedExcelIds", JSON.stringify(combined));
    },
    setSelectedFolderView: (state, action) => {
      state.selectFolderView = action.payload;
    },
    openAttachmentPreview: (state, action) => {
      state.previewAttachment = action.payload;
      state.isAttachmentPreviewOpen = true;
    },
    closeAttachmentPreview: (state) => {
      state.previewAttachment = null;
      state.isAttachmentPreviewOpen = false;
    },
    setFolderData: (state, action) => {
      state.folderData = Array.isArray(action.payload) ? action.payload : [];
    },
    setAttachmentFolderData: (state, action) => {
      state.attachmentFolderData = Array.isArray(action.payload)
        ? action.payload
        : [];
    },
  },
});

export const {
  setLoading,
  setIsGroupVisible,
  setDashboardData,
  setShowDashboard,
  setCurrentPage,
  setItemsPerPage,
  setMessageTableData,
  setSyncPendingItems,
  setSearchText,
  pushToHistoryStack,
  popFromHistoryStack,
  setSelectedAttachment,
  setAttachmentTableData,
  setDownloadingAttachmentId,
  toggleSelectAttachment,
  toggleSelectAllAttachments,
  resetSelectedAttachments,
  setIsDownloadingLoad,
  setIsDownloadExcel,
  addDownloadedExcelIds,
  setSelectedFolderView,
  openAttachmentPreview,
  closeAttachmentPreview,
  setFolderData,
  setAttachmentFolderData,
} = Slice.actions;
export default Slice.reducer;
