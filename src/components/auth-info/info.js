import React from 'react';
import { Avatar, Typography, Button, Dropdown, Menu, Space } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { UserDropDwon } from './auth-info-style';
import Heading from '../heading/heading';
import Link from 'next/link';
import { Popover } from '../popup/popup';
import Image from 'next/image';
import { signOut } from "next-auth/react";
import { PAGE_LOGIN, PROFILE_PAGE } from '@/config/page-routes';

const { Text } = Typography;

function AuthInfo(props) {
  let { ProfileObjectData } = props;
const handlelogout = () => {
    signOut({ callbackUrl: PAGE_LOGIN });
  };
  let details = ProfileObjectData?.data?.data;
  let user_name = ProfileObjectData?.data?.data?.data?.username || 'User';
  let user_role = ProfileObjectData?.data?.data?.data?.role || 'Employee';
  let imgUrl = `https://ui-avatars.com/api/?background=063554&color=fff&name=${user_name}`;

  const menu = (
    <Menu style={{ minWidth: 180, borderRadius: 10, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <Menu.Item key="profile">
        <Link href={PROFILE_PAGE} style={{ display: 'flex', alignItems: 'center' }}>
          <FeatherIcon icon="user" style={{ marginRight: 8 }} /> Profile
            </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <a onClick={handlelogout} style={{ display: 'flex', alignItems: 'center', color: '#d4380d' }}>
          <FeatherIcon icon="log-out" style={{ marginRight: 8 }} /> Sign Out
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="nav-author" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', minWidth: 0 }}>
      <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
        <Button
          type="text"
          style={{
            padding: 0,
            border: 'none',
            boxShadow: 'none',
            background: 'none',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 24,
            transition: 'background 0.2s',
          }}
        >
          <Space size={12} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ textAlign: 'right', marginRight: 4 }}>
              <Text strong style={{ color: '#063554', fontSize: 15, lineHeight: 1 }}>{user_name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>{user_role}</Text>
            </div>
            <Avatar
              src={imgUrl}
              size={44}
              style={{ border: '2px solid #063554', background: '#fff', boxShadow: '0 2px 8px rgba(6,53,84,0.08)' }}
            />
          </Space>
        </Button>
      </Dropdown>
      </div>
  );
}

export default AuthInfo;
