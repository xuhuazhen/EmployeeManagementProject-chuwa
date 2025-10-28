export const formatProfile = (p) => ({
  ...p,
  name: `${p.personalInfo?.lastName || ""} ${p.personalInfo?.firstName || ""}`,
});
