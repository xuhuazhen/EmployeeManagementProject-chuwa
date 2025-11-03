import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const DownloadButton = ({ url, children }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = url.split("/").pop(); // 使用文件名作为下载名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      style={{backgroundColor: "#4472CA"}}
      type="primary"
      icon={<DownloadOutlined />}
      onClick={handleDownload}
    >
      {children}
    </Button>
  );
};

export default DownloadButton;