/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import Nav from "../../Components/Header/Nav";
import DashboardMain from "../../Features/FeatureDashboard/DashboardMain";
import Handlers from "../../Services/Toolkit/Handlers";
import APIErrorView from "../../Components/Error/APIErrorView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { fetchDashboardData, dashboardData } = Handlers();

  useEffect(() => {
    if (!dashboardData) {
      fetchDashboardData();
    }
  }, []);

  return (
    <>
      <ToastContainer
        autoClose={2000}  
        position="top-center"
        className={`custom-toast-container`}
      />
      <>
        <div className={`relative object-cover w-full bg-[#f2f2f2]`}>
          <DashboardMain />
        </div>
      </>
    </>
  );
};

export default Dashboard;
