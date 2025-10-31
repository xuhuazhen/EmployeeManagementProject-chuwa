// import styles from "./SearchBar.module.css";
// import { Input, Spin } from "antd";
// import { SearchOutlined } from "@ant-design/icons";

// const SearchBar = ({ placeholder, onSearch, value }) => {
//   return (
//     <Input
//       size="large"
//       autoComplete="off"
//       placeholder={placeholder}
//       value={value}
//       onChange={(e) => onSearch(e.target.value)}
//       allowClear
//       className={styles.searchInput}
//     />
//   );
// };

// export default SearchBar;

import styles from "./SearchBar.module.css";
import { Input, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(value); // call parent with the current input
    }, 300); // 300ms debounce
    return () => clearTimeout(delay);
  }, [value, onSearch]);

  return (
    <Input
      size="large"
      autoComplete="off"
      placeholder="Search employee..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      allowClear
      className={styles.searchInput}
    />
  );
};

export default SearchBar;
