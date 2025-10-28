// import { Input, Spin } from "antd";
// import { useState, useMemo, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import debounce from "lodash.debounce";
// import { setQuery, clearSearchResults } from "../../store/search/searchSlice";
// import { fetchSearchThunk } from "../../store/search/searchThunk";
// import { SearchOutlined } from "@ant-design/icons";
// import styles from "./SearchBar.module.css";

// const SearchProduct = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [open, setOpen] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const containerRef = useRef(null);
//   const { results, status } = useSelector((store) => store.search);

//   // Debounced search
//   const debouncedSearch = useMemo(
//     () =>
//       debounce(async (value) => {
//         const query = value.trim();
//         dispatch(setQuery(query));

//         if (query.length <= 1) {
//           dispatch(clearSearchResults());
//           return;
//         }

//         await dispatch(fetchSearchThunk(query));
//       }, 300),
//     [dispatch]
//   );

//   // Cleanup debounce on unmount
//   useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (!containerRef.current?.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, []);

//   // Handle input changes
//   const searchHandler = (value) => {
//     setSearchInput(value);

//     if (value.trim().length === 0) {
//       dispatch(clearSearchResults());
//       setOpen(false);
//       return;
//     }
//     debouncedSearch(value);
//   };

//   // Open dropdown only when results are ready
//   useEffect(() => {
//     const hasQuery = searchInput.trim().length > 0;

//     if (hasQuery && (status === "succeeded" || status === "failed")) {
//       setOpen(true);
//       return;
//     }

//     // Close when cleared or idle
//     if (!hasQuery || status === "idle") {
//       setOpen(false);
//     }
//   }, [status, searchInput]);

//   // Handle product click
//   const selectHandler = (id) => {
//     navigate(`/products/${id}`);
//     setOpen(false);
//   };

//   // Render dropdown content
//   const renderDropdown = () => {
//     if (results.length > 0) {
//       return results.map((item) => (
//         <div
//           key={item._id}
//           onClick={() => selectHandler(item._id)}
//           className="search-dropdown-item"
//         >
//           {item.name}
//         </div>
//       ));
//     }

//     if (searchInput.trim().length > 0 && status === "succeeded") {
//       return <div className="search-dropdown-item">No results found</div>;
//     }

//     return null;
//   };

//   return (
//     <div ref={containerRef} className={styles.searchContainer}>
//       <Input
//         size="large"
//         value={searchInput}
//         onChange={(e) => searchHandler(e.target.value)}
//         placeholder="Search"
//         autoComplete="off"
//         suffix={
//           status === "loading" ? (
//             <Spin size="small" />
//           ) : (
//             <SearchOutlined style={{ color: "#979797" }} />
//           )
//         }
//         onFocus={() => {
//           if (searchInput.trim() && results.length > 0) setOpen(true);
//         }}
//         className={styles.searchInput}
//       />

//       {open && <div className={styles.searchDropdown}>{renderDropdown()}</div>}
//     </div>
//   );
// };

// export default SearchProduct;

import { Input, Spin } from "antd";
// import { useState, useMemo, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import debounce from "lodash.debounce";
// import { setQuery, clearSearchResults } from "../../store/search/searchSlice";
// import { fetchSearchThunk } from "../../store/search/searchThunk";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./SearchBar.module.css";

const SearchProduct = () => {
  //   const [searchInput, setSearchInput] = useState("");
  //   const [open, setOpen] = useState(false);

  //   const dispatch = useDispatch();
  //   const navigate = useNavigate();
  //   const containerRef = useRef(null);
  //   const { results, status } = useSelector((store) => store.search);

  //   // Debounced search
  //   const debouncedSearch = useMemo(
  //     () =>
  //       debounce(async (value) => {
  //         const query = value.trim();
  //         dispatch(setQuery(query));

  //         if (query.length <= 1) {
  //           dispatch(clearSearchResults());
  //           return;
  //         }

  //         await dispatch(fetchSearchThunk(query));
  //       }, 300),
  //     [dispatch]
  //   );

  //   // Cleanup debounce on unmount
  //   useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  //   // Close dropdown when clicking outside
  //   useEffect(() => {
  //     const handleClickOutside = (e) => {
  //       if (!containerRef.current?.contains(e.target)) setOpen(false);
  //     };
  //     document.addEventListener("click", handleClickOutside);
  //     return () => document.removeEventListener("click", handleClickOutside);
  //   }, []);

  //   // Handle input changes
  //   const searchHandler = (value) => {
  //     setSearchInput(value);

  //     if (value.trim().length === 0) {
  //       dispatch(clearSearchResults());
  //       setOpen(false);
  //       return;
  //     }
  //     debouncedSearch(value);
  //   };

  //   // Open dropdown only when results are ready
  //   useEffect(() => {
  //     const hasQuery = searchInput.trim().length > 0;

  //     if (hasQuery && (status === "succeeded" || status === "failed")) {
  //       setOpen(true);
  //       return;
  //     }

  //     // Close when cleared or idle
  //     if (!hasQuery || status === "idle") {
  //       setOpen(false);
  //     }
  //   }, [status, searchInput]);

  //   // Handle product click
  //   const selectHandler = (id) => {
  //     navigate(`/products/${id}`);
  //     setOpen(false);
  //   };

  //   // Render dropdown content
  //   const renderDropdown = () => {
  //     if (results.length > 0) {
  //       return results.map((item) => (
  //         <div
  //           key={item._id}
  //           onClick={() => selectHandler(item._id)}
  //           className="search-dropdown-item"
  //         >
  //           {item.name}
  //         </div>
  //       ));
  //     }

  //     if (searchInput.trim().length > 0 && status === "succeeded") {
  //       return <div className="search-dropdown-item">No results found</div>;
  //     }

  //     return null;
  //   };

  return (
    // <div ref={containerRef} className={styles.searchContainer}>
    <Input
      size="large"
      // value={searchInput}
      // onChange={(e) => searchHandler(e.target.value)}
      placeholder="Search employees..."
      autoComplete="off"
      suffix={
        status === "loading" ? (
          <Spin size="small" />
        ) : (
          <SearchOutlined style={{ color: "#979797" }} />
        )
      }
      onFocus={() => {
        //   if (searchInput.trim() && results.length > 0) setOpen(true);
      }}
      className={styles.searchInput}
    />

    //   {open && <div className={styles.searchDropdown}>{renderDropdown()}</div>}
    // </div>
  );
};

export default SearchProduct;
