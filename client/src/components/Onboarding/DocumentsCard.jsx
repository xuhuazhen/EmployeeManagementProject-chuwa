// src/components/Profiles/DocumentsCard.jsx
import React from "react";
import { Form, Card, Divider, List, Button, Space } from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";

// 新增更多可识别的标签
const DRIVER_TAGS = ["driver-license"];

const WORK_AUTH_TAGS = [
  "opt-receipt",
  "ead",
  "i983",
  "i-983",          // 兼容可能的命名
  "i20",
  "i-20",           // 兼容可能的命名
  "green-card",
  "citizenship-proof",
  "work-auth",
];

export default function DocumentsCard({ form }) {
  // ✅ 用 Form.useWatch，能联动刷新
  const documents = Form.useWatch("documents", form) || [];

  const driverDocs = documents.filter((d) => DRIVER_TAGS.includes(d.tag));
  const workDocs = documents.filter((d) => WORK_AUTH_TAGS.includes(d.tag));

  const renderFileList = (docs) => (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={docs}
      renderItem={(doc) => (
        <List.Item key={`${doc.tag}-${doc.title}`}>
          <Card size="small" title={`${doc.tag.toUpperCase()} • ${doc.title || "file"}`}>
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
                  link.download = doc.title || `${doc.tag}.file`;
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
          <Divider orientation="left">Work Authorization & Others</Divider>
          {renderFileList(workDocs)}
        </>
      )}

      {driverDocs.length === 0 && workDocs.length === 0 && (
        <div>No documents uploaded</div>
      )}
    </>
  );
}