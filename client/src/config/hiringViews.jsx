import dayjs from "dayjs";
import RegistrationToken from "../pages/Hiring/components/RegistrationTokenUI/RegistrationToken";

//Columns for email history tab
const emailHistoryColumns = [
  {
    title: "Name",
    dataIndex: ["name"],
    key: "name",
    render: (name) => <a>{name}</a>,
  },
  {
    title: "Email",
    dataIndex: ["email"],
    key: "email",
  },
  {
    title: "Registration Link",
    dataIndex: ["employment", "startDate"],
    key: "startDate",
    render: (date) => (date ? dayjs(date).format("MMM D, YYYY") : "—"),
  },
  {
    title: "Status",
    dataIndex: ["employment", "endDate"],
    key: "endDate",
    render: (date) => (date ? dayjs(date).format("MMM D, YYYY") : "—"),
  },
];

//Columns for onboarding tabs
const onboardingColumns = [
  { title: "Name", dataIndex: ["name"], key: "name" },
  { title: "Email", dataIndex: ["email"], key: "email" },
  {
    title: "Status",
    dataIndex: ["nextStep"],
    key: "nextStep",
    render: (status) => (
      <span
        style={{
          color:
            status === "approved"
              ? "green"
              : status === "rejected"
              ? "red"
              : "gray",
        }}
      >
        {status}
      </span>
    ),
  },
];

export const HIRING_VIEWS = [
  {
    key: "email history",
    label: "Email History",
    columns: emailHistoryColumns,
    component: RegistrationToken,
    modalConfig: {
      showDownload: true, // show download button
    },
  },
  {
    key: "onboarding",
    label: "Onboarding Applications",
    subTabs: [
      {
        key: "pending",
        label: "Pending",
        columns: onboardingColumns,
        filter: (profile) => profile.nextStep === "pending",
        modalConfig: {
          showApproveReject: true,
        },
      },
      {
        key: "approved",
        label: "Approved",
        columns: onboardingColumns,
        filter: (profile) => profile.nextStep === "approved",
        modalConfig: {
          showDownload: true,
        },
      },
      {
        key: "rejected",
        label: "Rejected",
        columns: onboardingColumns,
        filter: (profile) => profile.nextStep === "rejected",
        modalConfig: {
          showSendFeedback: true,
        },
      },
    ],
  },
];
