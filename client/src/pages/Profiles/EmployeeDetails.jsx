// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { fetchEmployeeById } from "../../../features/employees/employeeDetailThunk";
// import MainLayout from "../../../components/Layout/MainLayout";
// import { Spin, Typography, Divider } from "antd";
// import styles from "./EmployeeDetail.module.css";
// import ProfileSection from "./components/ProfileSection";
// import DetailCard from "./components/DetailCard";

// const { Title } = Typography;

// const EmployeeDetail = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { currentEmployee, detailLoading } = useSelector(
//     (state) => state.employees
//   );

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchEmployeeById(id));
//     }
//   }, [id, dispatch]);

//   if (detailLoading || !currentEmployee) {
//     return (
//       <MainLayout>
//         <div className={styles.loading}>
//           <Spin tip="Loading employee details..." />
//         </div>
//       </MainLayout>
//     );
//   }

//   const { personalInfo, contactInfo, employment, email } = currentEmployee;

//   return (
//     <MainLayout>
//       <div className={styles.container}>
//         <Title level={3}>
//           {personalInfo?.firstName} {personalInfo?.lastName}
//         </Title>
//         <Divider />
//         <ProfileSection title="Personal Information">
//           <DetailCard label="SSN" value={personalInfo?.ssn || "N/A"} />
//           <DetailCard
//             label="Date of Birth"
//             value={personalInfo?.dob || "N/A"}
//           />
//           <DetailCard label="Gender" value={personalInfo?.gender || "N/A"} />
//         </ProfileSection>

//         <ProfileSection title="Contact Information">
//           <DetailCard
//             label="Phone"
//             value={contactInfo?.cellPhoneNumber || "N/A"}
//           />
//           <DetailCard label="Email" value={email || "N/A"} />
//           <DetailCard label="Address" value={contactInfo?.address || "N/A"} />
//         </ProfileSection>

//         <ProfileSection title="Employment Information">
//           <DetailCard label="Title" value={employment?.title || "N/A"} />
//           <DetailCard
//             label="Work Authorization"
//             value={employment?.visaTitle || "N/A"}
//           />
//           <DetailCard
//             label="Start Date"
//             value={employment?.startDate || "N/A"}
//           />
//           <DetailCard label="End Date" value={employment?.endDate || "N/A"} />
//         </ProfileSection>
//       </div>
//     </MainLayout>
//   );
// };

// export default EmployeeDetail;

// import React from "react";
// import { Card, Typography, Divider } from "antd";
// import styles from "./EmployeeDetails.module.css";

// const { Title, Text } = Typography;

// const EmployeeDetails = ({ employee }) => {
//   if (!employee) return <Text>No employee selected.</Text>;

//   return (
//     <div className={styles.container}>
//       <Header employee={employee} />
//       <Divider />
//       <DetailCard title="Personal Info">
//         <Text>
//           <strong>Full Name:</strong> {employee.fullName}
//         </Text>
//         <br />
//         <Text>
//           <strong>Email:</strong> {employee.email}
//         </Text>
//         <br />
//         <Text>
//           <strong>Phone:</strong> {employee.phone}
//         </Text>
//       </DetailCard>

//       <DetailCard title="Work Authorization">
//         <Text>
//           <strong>Title:</strong> {employee.title}
//         </Text>
//         <br />
//         <Text>
//           <strong>Work Auth:</strong> {employee.workAuthorization}
//         </Text>
//         <br />
//         <Text>
//           <strong>Start Date:</strong> {employee.startDate}
//         </Text>
//         <br />
//         <Text>
//           <strong>End Date:</strong> {employee.endDate}
//         </Text>
//       </DetailCard>
//     </div>
//   );
// };

// // --------------------------
// // Inline subcomponents below
// // --------------------------

// const Header = ({ employee }) => (
//   <div className={styles.header}>
//     <Title level={3}>{employee.fullName}</Title>
//     <Text type="secondary">{employee.email}</Text>
//   </div>
// );

// const DetailCard = ({ title, children }) => (
//   <Card className={styles.detailCard} title={title} bordered={false}>
//     {children}
//   </Card>
// );

// export default EmployeeDetails;
