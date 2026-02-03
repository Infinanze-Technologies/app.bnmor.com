 <!-- <div 
          className="admin-sidebar-scroll"
          style={{
            height: 'calc(100vh - 120px)', // Subtract header height
            overflowY: 'auto',
            overflowX: 'hidden',
            paddingRight: '4px',
          }}
        >
          <Menu
            theme="light"
            mode="inline"
            items={adminMenuItems}
            onClick={handleMenuClick}
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={setOpenKeys}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0 8px',
              height: '100%',
            }}
            className="admin-menu"
          />
        </div>




           
        /* Custom scrollbar styling for sidebar */
        .admin-sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .admin-sidebar-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }
        
        .admin-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(95, 99, 242, 0.3);
          border-radius: 3px;
          transition: all 0.3s ease;
        }
        
        .admin-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(95, 99, 242, 0.5);
        }
        
        /* Firefox scrollbar styling */
        .admin-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(95, 99, 242, 0.3) rgba(0, 0, 0, 0.05);
        } --># app.bnmor.com
