import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
 
// props: onChange 回调会收到 file 对象
const UploadButton = ({ onFileSelect, isShow = true, type = "any" }) => { 
   const acceptMap = {
    img: "image/*",
    doc: ".pdf,image/*",
    any: "*",
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";

    if (type === "img" && !isImage) {
      message.error("Only image files are allowed!");
      return Upload.LIST_IGNORE;
    }

    if (type === "doc" && !(isImage || isPDF)) {
      message.error("Only PDF or image files are allowed!");
      return Upload.LIST_IGNORE;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("File must be smaller than 5MB!");
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  return ( 
    <Upload 
      accept={acceptMap[type]} 
      beforeUpload={beforeUpload} // 阻止自动上传
      onChange={({ file }) => {
        // onChange 中的 file.originFileObj 才是原生 File
        if (file) onFileSelect(file);
      }}
      maxCount={1} // 限制只能选一个文件 \ 
      onRemove={() => onFileSelect(null)}
      showUploadList={{ showRemoveIcon: isShow }}
    >
      <Button 
        style={{color: 'white', backgroundColor: "#4472CA"}} 
        icon={<UploadOutlined />}>
        Select file
      </Button>
    </Upload> 
  );
};

export default UploadButton;