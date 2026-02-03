import dynamic from 'next/dynamic';

// Dynamically import the tabs component with no SSR
const ManagementSettingsTabsClient = dynamic(
  () => import('./ManagementSettingsTabsClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="management-settings-tabs" style={{ marginBottom: '24px' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '16px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span>Loading tabs...</span>
        </div>
      </div>
    )
  }
);

const ManagementSettingsTabsWrapper = (props) => {
  return <ManagementSettingsTabsClient {...props} />;
};

export default ManagementSettingsTabsWrapper;
