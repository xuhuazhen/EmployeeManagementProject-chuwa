import { Upload, Button, Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";

// props: onChange 回调会收到 file 对象
const UploadButton = ({ onFileSelect }) => { 
 

  return ( 
    <Upload style={{ maxWidth: 300 }}
        beforeUpload={() => false} // 阻止自动上传
        onChange={({ file }) => {
          // onChange 中的 file.originFileObj 才是原生 File
          if (file) onFileSelect(file);
        }}
        maxCount={1} // 限制只能选一个文件 \ 
        onRemove={() => onFileSelect(null)}
    >
        <Button icon={<UploadOutlined />}>
            Select file
        </Button>
    </Upload> 
  );
};

export default UploadButton;