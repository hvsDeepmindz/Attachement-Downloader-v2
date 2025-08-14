import React from "react";
import Chart from "react-apexcharts";
import Handlers from "../../Services/Toolkit/Handlers";
import { Empty } from "antd";

const DashboardAttachments = () => {
  const { dashboardData, showDashboard } = Handlers();

  const attachmentData = dashboardData?.attachment_data || {
    total_candidates: 0,
    duplicate_candidates: 0,
    total_jd: 0,
    duplicate_jd: 0,
    common_files: 0,
  };

  const chartLabels = [
    "Total Candidates",
    "Duplicate Candidates",
    "Total JD",
    "Duplicate JD",
    "Common Files",
  ];

  const chartValues = [
    attachmentData.total_candidates,
    attachmentData.duplicate_candidates,
    attachmentData.total_jd,
    attachmentData.duplicate_jd,
    attachmentData.common_files,
  ];

  const chartValuesDefault = [0, 0, 0, 0, 0];

  const chartOptions = {
    chart: {
      type: "pie",
    },
    labels: chartLabels,
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
      },
      formatter: function (val) {
        return `${val.toFixed(1)}%`;
      },
    },
    legend: {
      show: false,
    },
    colors: ["#8A55DD", "#765EA5", "#2E125A", "#AA84E6", "#CDB7F1"],
    stroke: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            offsetY: 0,
            offsetX: 0,
          },
        },
      },
    ],
  };

  return (
    <div className="bg-white relative object-cover px-[3rem] py-[3rem] rounded-xl flex flex-col gap-[1rem] shadow-md transition-all duration-[0.4s] ease-in-out hover:translate-y-[-1rem] cursor-pointer max-xl:w-full">
      <div className="flex justify-between items-center gap-[2rem] w-full">
        <div className="flex items-center gap-[2rem]">
          <div className="bg-[#EAEFF5] cursor-pointer rounded-xl px-[1rem] py-[1rem] w-auto h-auto">
            <img
              src={`${import.meta.env.BASE_URL}/Media/clip.png`}
              alt="attachment"
              className="w-[24px] h-[24px] object-cover"
            />
          </div>
          <h2 className="text-[2.2rem] font-semibold text-[#4D4D4D]">
            Total Attachments
          </h2>
        </div>
        <div className="flex justify-end w-auto">
          <select
            name="date"
            id="date"
            className="px-[2rem] py-[1rem] outline-none border-[1px] border-[#d2d2d2] text-[#4D4D4D] font-normal text-[1.8rem] rounded-xl cursor-pointer"
          >
            <option value="week">This Week</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between max-sm:flex-col max-sm:justify-center gap-[4rem] w-full items-center px-[0rem] mt-[2rem]">
        {showDashboard ? (
          <div className="w-[300px] h-[300px] max-sm:w-full max-sm:h-[280px]">
            <Chart
              options={chartOptions}
              series={chartValues}
              type="pie"
              width="100%"
              height="100%"
            />
          </div>
        ) : (
          <Empty />
        )}

        <div className="grid grid-cols-2 gap-[3rem] ml-[4rem] max-sm:flex max-sm:m-0 max-sm:shrink-0 max-sm:grow-0 overflow-x-auto max-sm:max-w-2xl max-sm:gap-[6rem] max-sm:px-[2rem] no-scrollbar">
          <div className="flex items-start gap-[1rem]">
            <div className="rounded-full px-[0.8rem] py-[0.8rem] bg-[#8A55DD] mt-[0.5rem]"></div>
            <div className="flex flex-col gap-[0.5rem]">
              <p className="text-[1.6rem] font-normal text-[#999999]">
                Total Candidates
              </p>
              <p className="text-[1.8rem] font-normal text-[#4D4D4D]">
                {attachmentData.total_candidates}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-[1rem]">
            <div className="rounded-full px-[0.8rem] py-[0.8rem] bg-[#765EA5] mt-[0.5rem]"></div>
            <div className="flex flex-col gap-[0.5rem]">
              <p className="text-[1.6rem] font-normal text-[#999999]">
                Duplicate Candidates
              </p>
              <p className="text-[1.8rem] font-normal text-[#4D4D4D]">
                {attachmentData.duplicate_candidates}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-[1rem]">
            <div className="rounded-full px-[0.8rem] py-[0.8rem] bg-[#2E125A] mt-[0.5rem]"></div>
            <div className="flex flex-col gap-[0.5rem]">
              <p className="text-[1.6rem] font-normal text-[#999999]">
                Total JD
              </p>
              <p className="text-[1.8rem] font-normal text-[#4D4D4D]">
                {attachmentData.total_jd}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-[1rem]">
            <div className="rounded-full px-[0.8rem] py-[0.8rem] bg-[#AA84E6] mt-[0.5rem]"></div>
            <div className="flex flex-col gap-[0.5rem]">
              <p className="text-[1.6rem] font-normal text-[#999999]">
                Duplicate JD
              </p>
              <p className="text-[1.8rem] font-normal text-[#4D4D4D]">
                {attachmentData.duplicate_jd}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-[1rem]">
            <div className="rounded-full px-[0.8rem] py-[0.8rem] bg-[#CDB7F1] mt-[0.5rem]"></div>
            <div className="flex flex-col gap-[0.5rem]">
              <p className="text-[1.6rem] font-normal text-[#999999]">
                Common Files
              </p>
              <p className="text-[1.8rem] font-normal text-[#4D4D4D]">
                {attachmentData.common_files}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAttachments;
