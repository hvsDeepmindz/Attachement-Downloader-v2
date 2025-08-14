/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import {
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
} from "./Slice";
import { useEffect } from "react";
import { userLogin, userLogout } from "../../../config";
import { DashboardData } from "../APIs/DashboardAPI";
import { toast } from "react-toastify";
import { FolderBasedMessageData, MessageData } from "../APIs/MessagesAPI";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SyncData, SyncStatus } from "../APIs/SyncAPI";
import { SearchMessage } from "../APIs/SearchMessageAPI";
import {
  AttachmentTableData,
  DownloadAllAttachments,
  DownloadAttachments,
  ExcelDownload,
  FolderBasedAttachmentData,
} from "../APIs/AttachmentAPI";
import { AttachmentData } from "../Data/AttachmentData";
import {
  GetAllAttachmentFolder,
  GetAllMessageFolder,
} from "../APIs/AttachmentFolder";
import { MoveToFolderData } from "../APIs/MoveToFolderAPI";

const Handlers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { title: routeParamTitle } = useParams();
  const location = useLocation();

  const {
    isLoading,
    isGroupVisible,
    dashboardData,
    showDashboard,
    currentPage,
    itemsPerPage,
    messageTableData,
    totalItems,
    totalPages,
    syncPendingItems,
    searchText,
    selectedAttachment,
    attachmentTableData,
    historyStack,
    downloadingAttachmentId,
    selectedAttachmentIds,
    selectAllAttachments,
    isDownloadingLoad,
    isDownloadExcel,
    downloadedExcelIds,
    selectFolderView,
    isAttachmentPreviewOpen,
    previewAttachment,
    folderData,
    attachmentFolderData,
  } = useSelector((state) => state.app);

  const handleLoad = () => {
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 2000);
  };

  const handleLogin = () => {
    window.location.href = userLogin;
  };

  const handleLogout = () => {
    toast.success("Logout successfully!");
    setTimeout(() => {
      window.location.href = userLogout;
    }, 1000);
  };

  const showGroupMenu = () => {
    dispatch(setIsGroupVisible(true));
  };

  const hideGroupMenu = () => {
    dispatch(setIsGroupVisible(false));
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  };

  // API Func

  const fetchDashboardData = async () => {
    dispatch(setLoading(true));
    try {
      const { status, data } = await DashboardData();
      if (status === 401) {
        toast.error("Not authenticated");
        dispatch(setDashboardData(null));
        dispatch(setShowDashboard(false));
        setTimeout(() => {
          // pushHistory("/login");
        }, 3000);
        return;
      }
      if (status !== 200) {
        dispatch(setDashboardData(null));
        dispatch(setShowDashboard(false));
        setTimeout(() => {
          // pushHistory("/login");
        }, 3000);
        return;
      }
      dispatch(setDashboardData(data));
      dispatch(setShowDashboard(true));
    } catch {
      toast.error("Failed to fetch dashboard data");
      dispatch(setDashboardData(null));
      dispatch(setShowDashboard(false));
      setTimeout(() => {
        // pushHistory("/login");
      }, 2000);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchMessageData = async (
    page = currentPage,
    perPage = itemsPerPage,
    folderIdOverride = null
  ) => {
    dispatch(setLoading(true));
    try {
      let folder =
        folderData.find((f) => f.displayName === selectFolderView) ||
        folderData[0];

      if (folderIdOverride) {
        folder = folderData.find((f) => f.id === folderIdOverride) || folder;
      }

      if (!folder) {
        dispatch(
          setMessageTableData({ previews: [], totalPages: 0, totalItems: 0 })
        );
        return;
      }

      const res = await FolderBasedMessageData(folder.id, perPage, page);

      if (res?.previews) {
        updateTableData({
          previews: res.previews,
          totalPages: res["total pages"] || 0,
          totalItems: res.totalItems || res.previews.length,
        });
        dispatch(setShowDashboard(true));
      } else {
        updateTableData({ previews: [], totalPages: 0, totalItems: 0 });
        dispatch(setShowDashboard(false));
      }
    } catch {
      updateTableData({ previews: [], totalPages: 0, totalItems: 0 });
      dispatch(setShowDashboard(false));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchAttachmentData = async (folderNameOrId) => {
    dispatch(setLoading(true));
    try {
      let folder =
        typeof folderNameOrId === "number"
          ? attachmentFolderData.find((f) => f.id === folderNameOrId)
          : attachmentFolderData.find((f) => f.display_name === folderNameOrId);

      if (!folder) {
        dispatch(setAttachmentTableData({ attachments: [] }));
        return;
      }
      const res = await FolderBasedAttachmentData(folder.id);
      if (res?.attachments) {
        updateTableData({ attachments: res.attachments }, "attachment");
        dispatch(setShowDashboard(true));
      } else {
        updateTableData({ attachments: [] }, "attachment");
        dispatch(setShowDashboard(false));
      }
    } catch {
      updateTableData({ attachments: [] }, "attachment");
      dispatch(setShowDashboard(false));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchSyncData = async () => {
    dispatch(setLoading(true));
    try {
      const result = await SyncData();
      if (result && typeof result === "string") {
        toast.success(result);
      } else {
        toast.info("No sync information returned");
      }
      await fetchDashboardData();
    } catch {
      toast.error("Sync failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchMessageFolderData = async () => {
    try {
      const res = await GetAllMessageFolder();
      updateTableData({ previews: [], totalPages: 0, totalItems: 0 });
      dispatch({ type: "app/setFolderData", payload: res || [] });
    } catch {
      dispatch({ type: "app/setFolderData", payload: [] });
    }
  };

  const fetchAttachmentFolderData = async () => {
    try {
      const res = await GetAllAttachmentFolder();

      const updatedData = (res || []).map((item) => {
        const match = AttachmentData.find((a) => a.value === item.value);
        return {
          ...item,
          icon: match?.icon || "/default_icon.png",
        };
      });

      dispatch(setAttachmentFolderData(updatedData));
    } catch (err) {
      dispatch(setAttachmentFolderData([]));
    }
  };

  // End fetch API func

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = location.pathname.includes("/attachments")
    ? attachmentTableData?.table_data || []
    : messageTableData || [];

  const updateTableData = (payload, type = "message") => {
    if (type === "attachment") {
      if (payload?.attachments) {
        dispatch(setAttachmentTableData(payload));
      } else if (Array.isArray(payload)) {
        dispatch(setAttachmentTableData({ attachments: payload }));
      }
    } else {
      if (payload?.previews) {
        dispatch(setMessageTableData(payload));
      } else if (Array.isArray(payload)) {
        dispatch(setMessageTableData({ previews: payload }));
      }
    }
  };

  const handlePageChange = async (
    page,
    tableType = "message",
    attachmentValue = ""
  ) => {
    if (page > 0 && page <= totalPages) {
      dispatch(setCurrentPage(page));
      dispatch(setLoading(true));
      if (tableType === "message") {
        await fetchMessageData(page, itemsPerPage);
      }
      dispatch(setLoading(false));
    }
  };

  const handleItemsPerPageChange = async (
    value,
    tableType = "message",
    attachmentValue = ""
  ) => {
    dispatch(setItemsPerPage(value));
    dispatch(setCurrentPage(1));
    dispatch(setLoading(true));
    if (tableType === "message") {
      await fetchMessageData(1, value);
    }
    dispatch(setLoading(false));
  };

  const handleSearchTextChange = (text) => {
    dispatch(setSearchText(text));
  };

  const handleSearchSubmit = async () => {
    const trimmed = searchText.trim();
    const isAttachment = location.pathname.includes("/attachments");

    if (trimmed === "") {
      if (isAttachment) {
        fetchAttachmentData(routeParamTitle);
      } else {
        fetchMessageData(1, itemsPerPage);
      }
      return;
    }

    dispatch(setLoading(true));

    if (isAttachment) {
      const decodedValue = decodeURIComponent(routeParamTitle);
      const matchedItem =
        selectedAttachment?.value === decodedValue
          ? selectedAttachment
          : AttachmentData.find((item) => item.value === decodedValue);

      const isDuplicate =
        matchedItem?.title === "Dupliacte CVs" ||
        matchedItem?.title === "Dupliacte JDs";

      const res = await AttachmentTableData(
        decodedValue,
        isDuplicate ? 1 : 0,
        1,
        itemsPerPage,
        trimmed
      );

      if (res) {
        dispatch(setAttachmentTableData(res));
        dispatch(setCurrentPage(1));
      }
    } else {
      const res = await SearchMessage({
        text: trimmed,
        currentPage: 1,
        itemsPerPage,
      });

      if (res?.table_data) {
        dispatch(setMessageTableData(res));
        dispatch(setCurrentPage(1));
      }
    }

    dispatch(setLoading(false));
  };

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/attachments")) {
      dispatch(setCurrentPage(1));
    } else if (path.includes("/messages") || path === "/dashboard") {
      dispatch(setCurrentPage(1));
    }
  }, [location.pathname]);

  const pushHistory = (path) => {
    const currentPath = location.pathname;
    if (historyStack[historyStack.length - 1] !== currentPath) {
      dispatch(pushToHistoryStack(currentPath));
    }
    navigate(path);
  };

  const popHistory = () => {
    dispatch(popFromHistoryStack());
    const prevPath = historyStack[historyStack.length - 1] || "/dashboard";
    navigate(prevPath);
  };

  const handleAttachmentClick = async (folder) => {
    dispatch(setSelectedFolderView(folder.display_name));
    dispatch(setCurrentPage(1));
    await fetchAttachmentData(folder.display_name);
    pushHistory(`/attachments/${encodeURIComponent(folder.display_name)}`);
  };

  const handleDownloadAttachments = async (attachmentId) => {
    dispatch(setIsDownloadingLoad(true));
    try {
      const idsToDownload = attachmentId
        ? [attachmentId]
        : selectedAttachmentIds.length > 0
        ? selectedAttachmentIds
        : [];

      if (idsToDownload.length === 0) {
        toast.warning("No attachments selected for download");
        return;
      }

      if (idsToDownload.length === 1) {
        dispatch(setDownloadingAttachmentId(idsToDownload[0]));
      }

      const res = await DownloadAttachments(idsToDownload);

      if (!res || !res.blob) {
        toast.error("Invalid file response");
        return;
      }

      const url = window.URL.createObjectURL(res.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = res.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download complete");
    } catch {
      toast.error("Download failed");
    } finally {
      dispatch(setDownloadingAttachmentId(null));
      dispatch(setIsDownloadingLoad(false));
    }
  };

  const handleDownloadAllAttachments = async (filename) => {
    try {
      dispatch(setIsDownloadingLoad(true));
      const blob = await DownloadAllAttachments(filename);
      if (!blob || !(blob instanceof Blob)) {
        toast.error("Invalid file response");
        return;
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download complete");
    } catch (error) {
      toast.error("Download failed");
      dispatch(setIsDownloadingLoad(false));
    } finally {
      dispatch(setIsDownloadingLoad(false));
    }
  };

  const handleMoveToFolder = async (targetFolderId, attachmentId = null) => {
    try {
      const idsToMove = attachmentId
        ? [attachmentId]
        : selectedAttachmentIds.length > 0
        ? selectedAttachmentIds
        : [];

      if (idsToMove.length === 0) {
        toast.warning("No attachments selected to move");
        return;
      }

      dispatch(setLoading(true));

      const res = await MoveToFolderData(targetFolderId, idsToMove);

      if (res) {
        toast.success("Attachment(s) moved successfully");

        // Refresh current folder data from backend immediately
        const currentFolder = attachmentFolderData.find(
          (f) => f.display_name === selectFolderView
        );

        if (currentFolder) {
          // Wait for backend to update, then refetch latest
          await fetchAttachmentData(currentFolder.display_name);
        }
      } else {
        toast.error("Failed to move attachments");
      }
    } catch {
      toast.error("Failed to move attachments");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleExcelDownload = async () => {
    const ids = selectedAttachmentIds;
    if (ids.length === 0) return;
    if (ids.length > 5) {
      toast.warning("Select max 5 data at once");
      return;
    }
    dispatch(setIsDownloadExcel(true));
    try {
      await ExcelDownload(ids);
      dispatch(addDownloadedExcelIds(ids));
      toast.success("Excel downloaded successfully");
    } catch {
      toast.error("Excel download failed");
    } finally {
      dispatch(setIsDownloadExcel(false));
    }
  };

  const toggleAttachmentSelect = (id) => {
    dispatch(toggleSelectAttachment(id));
  };

  const toggleSelectAllAttachmentRows = (rows) => {
    const allIds = rows.map((r) => r.id);
    dispatch(toggleSelectAllAttachments(allIds));
  };

  const handleSelectFolderView = async (selectedValue) => {
    const folder = folderData.find((f) => f.displayName === selectedValue);
    dispatch(setSelectedFolderView(selectedValue));
    dispatch(setCurrentPage(1));
    if (folder) {
      await fetchMessageData(1, itemsPerPage, folder.id);
    }
  };

  const handleOpenAttachmentPreview = (attachmentRow) => {
    dispatch(openAttachmentPreview(attachmentRow));
  };

  const handleCloseAttachmentPreview = () => {
    dispatch(closeAttachmentPreview());
  };

  useEffect(() => {
    dispatch(resetSelectedAttachments());
  }, [attachmentTableData]);

  return {
    isLoading,
    handleLoad,
    handleLogin,
    handleLogout,
    isGroupVisible,
    showGroupMenu,
    hideGroupMenu,
    dashboardData,
    getInitials,
    showDashboard,
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    messageTableData,
    paginatedData,
    handlePageChange,
    handleItemsPerPageChange,
    updateTableData,
    syncPendingItems,
    searchText,
    handleSearchTextChange,
    handleSearchSubmit,
    selectedAttachment,
    attachmentTableData,
    handleAttachmentClick,
    handleDownloadAttachments,
    handleDownloadAllAttachments,
    handleExcelDownload,
    historyStack,
    pushHistory,
    popHistory,
    downloadingAttachmentId,
    toggleAttachmentSelect,
    toggleSelectAllAttachmentRows,
    selectedAttachmentIds,
    downloadedExcelIds,
    selectAllAttachments,
    isDownloadingLoad,
    isDownloadExcel,
    handleSelectFolderView,
    selectFolderView,
    handleOpenAttachmentPreview,
    handleCloseAttachmentPreview,
    isAttachmentPreviewOpen,
    previewAttachment,
    folderData,
    attachmentFolderData,
    handleMoveToFolder,
    // Api func
    fetchDashboardData,
    fetchMessageData,
    fetchSyncData,
    fetchAttachmentData,
    fetchMessageFolderData,
    fetchAttachmentFolderData,
  };
};

export default Handlers;
