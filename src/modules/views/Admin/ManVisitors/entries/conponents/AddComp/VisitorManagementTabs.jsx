import { useState } from "react";
import { Tabs } from "antd";
import AddEntry from "./AddEntry";
import AddAppointments from "./AddAppointments";

const { TabPane } = Tabs;

const VisitorManagementTabs = (props) => {
  const [activeTab, setActiveTab] = useState("entry");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div style={{ 
      maxWidth: 900, 
      margin: "0 auto", 
      padding: 24,
      maxHeight: '80vh',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        type="card"
        size="large"
        style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          padding: '0 24px 24px 24px'
        }}
        tabBarStyle={{
          marginBottom: 0,
          borderBottom: '1px solid #f0f0f0'
        }}
        items={[
          {
            key: 'entry',
            label: (
              <span style={{ 
                fontSize: 16, 
                fontWeight: 600,
                color: activeTab === 'entry' ? '#1890ff' : '#666'
              }}>
                📝 Create Entry
              </span>
            ),
            children: (
              <div style={{ paddingTop: 24 }}>
                <AddEntry {...props} />
              </div>
            )
          },
          {
            key: 'appointment',
            label: (
              <span style={{ 
                fontSize: 16, 
                fontWeight: 600,
                color: activeTab === 'appointment' ? '#1890ff' : '#666'
              }}>
                📅 Schedule Appointment
              </span>
            ),
            children: (
              <div style={{ paddingTop: 24 }}>
                <AddAppointments {...props} />
              </div>
            )
          }
        ]}
      />
    </div>
  );
};

export default VisitorManagementTabs;
