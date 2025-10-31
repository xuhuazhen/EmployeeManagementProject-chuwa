import React from "react";
import { Card, Divider, List, Button, Space } from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";

const VALID_TAGS = ["driver-license", "ead", "i20", "i983"];

export default function DocumentsCard({ form }) {
    
    const documents = form.getFieldValue("documents") || [];

  // Driver License 文件
  const driverDocs = documents.filter((doc) => doc.tag === "driver-license");

  // Work authorized 文件
  const workDocs = documents.filter((doc) =>
    ["ead", "i20", "i983"].includes(doc.tag)
  );

  const renderFileList = (docs) => (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={docs}
      renderItem={(doc) => (
        <List.Item key={doc._id}>
          <Card size="small" title={doc.title}>
            <Space>
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => window.open(doc.url, "_blank")}
              >
                Preview
              </Button>
              <Button
                type="link"
                icon={<DownloadOutlined />}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = doc.url;
                  link.download = doc.title;
                  link.click();
                }}
              >
                Download
              </Button>
            </Space>
          </Card>
        </List.Item>
      )}
    />
  );

  return (
    <>
      {driverDocs.length > 0 && (
        <>
          <Divider orientation="left">Driver License</Divider>
          {renderFileList(driverDocs)}
        </>
      )}

      {workDocs.length > 0 && (
        <>
          <Divider orientation="left">Work Authorized Files</Divider>
          {renderFileList(workDocs)}
        </>
      )}

      {driverDocs.length === 0 && workDocs.length === 0 && (
        <div>No documents uploaded</div>
      )}
    </>
  );
}