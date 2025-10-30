import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

// props: onChange 回调会收到 file 对象
const UploadButton = ({ onChange }) => {
  return (
    <Upload
      beforeUpload={(file) => {
        // 阻止自动上传，直接调用 onChange
        onChange(file);
        return false; 
      }}
      showUploadList={false} // 不显示默认列表
    >
      <Button icon={<UploadOutlined />} style={{ width: 200 }}>
        Upload file
      </Button>
    </Upload>
  );
};

export default UploadButton;