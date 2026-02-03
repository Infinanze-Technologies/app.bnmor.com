import React from 'react'
import {  Card, Skeleton, Spin } from "antd";

function LoadingCard() {
  return (
    <>
        <Card style={{ height: "100%", width:"100%", marginTop:"5px" }}>
      <div style={{ padding: "25vh" }}>
        <Spin size='large' spinning>
          <Skeleton active title="loading" />
        </Spin>
      </div>
    </Card>
    </>
  )
}

export default LoadingCard