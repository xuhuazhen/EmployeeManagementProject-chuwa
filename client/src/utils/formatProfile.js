export const formatProfile = (profile) => {
  const { personalInfo = {} } = profile;
  const { firstName, middleName, lastName, preferredName } = personalInfo;

  const fullName = [lastName || "", middleName || "", firstName || ""]
    .filter(Boolean)
    .join(" ");

  const displayName = preferredName
    ? `${fullName} (${preferredName})`
    : fullName;

  return {
    ...profile, // keep all other fields intact
    name: displayName,
  };
};
