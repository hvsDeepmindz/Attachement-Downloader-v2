/* eslint-disable no-unused-vars */
import React from "react";
import AuthBtn from "../../Components/Btns/AuthBtn";
import Handlers from "../../Services/Toolkit/Handlers";

const LoginMain = () => {
  const { handleLogin, showDashboard } = Handlers();

  return (
    <>
      <div className={`w-full object-cover relative max-lg:hidden`}>
        <div
          className={`grid grid-cols-2 w-full justify-center max-lg:grid-cols-1`}
        >
          <div
            className={`flex justify-center items-center w-auto h-screen max-lg:h-[600px]`}
          >
            <img
              src={`${import.meta.env.BASE_URL}/Media/login.png`}
              alt="login"
              className={`w-full h-full object-cover`}
            />
          </div>
          <div
            className={`flex flex-col gap-[2rem] justify-center h-full items-center text-center px-[20rem] py-[2rem] max-xl:px-[10rem] max-lg:py-[10rem] max-sm:px-[5rem]`}
          >
            <div className={`flex gap-[1rem]`}>
              <img
                src={`${import.meta.env.BASE_URL}/Media/outlook.png`}
                alt="outlook"
                className="w-[40px] h-[40px] object-cover"
              />
              <h1 className={`text-[2.5rem] font-normal text-[#424242]`}>
                Outlook Attachment Downloader
              </h1>
            </div>
            <div
              onClick={handleLogin}
              className={`flex justify-center items-center w-full mt-[2rem] cursor-pointer`}
            >
              <AuthBtn
                btnTitle={`Sign in with Microsoft`}
                btnImg={`${import.meta.env.BASE_URL}/Media/microsoft.png`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}

      <div
        className="hidden max-lg:flex w-full h-screen relative bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}/Media/login.png)`,
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,50,0.1)]"></div>
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <div className="flex flex-col bg-white/5 backdrop-blur-[10px] rounded-2xl shadow-xl items-center justify-center gap-[2rem] text-center px-[10rem] py-[10rem] max-sm:px-[5rem]">
            <div className="flex items-center gap-[1rem]">
              <img
                src={`${import.meta.env.BASE_URL}/Media/outlook.png`}
                alt="outlook"
                className="w-[40px] h-[40px] object-cover"
              />
              <h1 className="text-[3rem] max-sm:text-[2.2rem] font-medium text-white">
                Outlook Attachment Downloader
              </h1>
            </div>
            <div
              onClick={handleLogin}
              className="flex justify-center items-center w-full mt-[2rem] cursor-pointer"
            >
              <AuthBtn
                btnTitle="Sign in with Microsoft"
                btnImg={`${import.meta.env.BASE_URL}/Media/microsoft.png`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginMain;
