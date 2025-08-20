import React from "react";
import Handlers from "../../Services/Toolkit/Handlers";
import { motion } from "framer-motion";
import { Skeleton } from "antd";
import { ToastContainer } from "react-toastify";

const AttachmentsMain = () => {
  const { handleAttachmentClick, attachmentFolderData, showDashboard } =
    Handlers();

  return (
    <>
      {showDashboard ? (
        <div className="pt-[12rem] max-sm:pt-0 px-[10rem] relative object-cover w-full flex justify-center items-center max-xl:px-[5rem] max-md:px-[2rem]">
          <div className="grid grid-cols-4 gap-[6rem] w-full relative justify-center items-center max-lg:grid-cols-3 max-sm:grid-cols-1 max-sm:gap-[4rem] h-full">
            {attachmentFolderData.map((ele) => (
              <div
                key={ele.id}
                onClick={() => handleAttachmentClick(ele)}
                className="px-[2rem] py-[2rem] bg-white transition-all duration-300 hover:opacity-80 cursor-pointer rounded-xl flex items-center gap-[2rem] shadow-sm hover:translate-y-[-0.5rem]"
              >
                <div className="w-auto h-auto flex items-center justify-center bg-[#F1EFF8] px-[1rem] py-[1rem] rounded-xl">
                  <i className="fa-solid fa-folder-open text-[2.5rem] text-[#765EA5]" />
                </div>
                <p className="text-[#4D4D4D] text-[2rem] font-semibold first-letter:capitalize">
                  {ele.display_name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <ToastContainer
            autoClose={2000}
            position="top-center"
            className={`custom-toast-container`}
          />
          <motion.div
            className="w-full grid grid-cols-3 max-xl:grid-cols-2 max-md:grid-cols-1 gap-[3rem] max-h-[800px] overflow-y-auto no-scrollbar py-[4rem] px-[6rem] max-xl:px-[5rem] max-md:px-[4rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="rounded-xl w-[100%] h-[300px] flex-shrink-0 flex-grow-0 px-[1rem] py-[0.5rem] shadow-md bg-[#bdbdbd]"
              >
                <Skeleton
                  active
                  paragraph={{ rows: 2, width: ["60%", "80%"] }}
                  title={{ width: "40%" }}
                  className="bg-[#c4c4c4]"
                />
              </div>
            ))}
          </motion.div>
        </>
      )}
    </>
  );
};
export default AttachmentsMain;
