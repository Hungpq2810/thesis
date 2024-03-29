import { useAppSelector } from '@/hooks/useRedux';
import {
  AuditOutlined,
  CalendarOutlined,
  ClusterOutlined,
  DashboardFilled,
  EditOutlined,
  HomeOutlined,
  MonitorOutlined,
  PullRequestOutlined,
  StarOutlined,
  UserAddOutlined,
  UserOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Layout, Menu, MenuProps, Typography, theme } from 'antd';
import { icons } from 'antd/es/image/PreviewGroup';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
const { Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

const SiderMenu = () => {
  const { user } = useAppSelector((state) => state.appSlice);
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const menuAdmin = [
    {
      key: '/',
      label: 'Trang chủ',
      icon: <HomeOutlined />
    },
    {
      key: '/admin',
      icon: <AuditOutlined />,
      label: 'Quản trị viên',
      children: [
        {
          key: '/profile',
          icon: <UserOutlined />,
          label: 'Thông tin cá nhân'
        },
        {
          key: '/change-password',
          label: 'Đổi mật khẩu',
          icon: <EditOutlined />
        },
        {
          key: '/admin',
          icon: <DashboardFilled />,
          label: 'Dashboard'
        },
        {
          key: '/admin/user',
          icon: <UserAddOutlined />,
          label: 'Quản lý tài khoản'
        },
        {
          key: '/admin/activity',
          icon: <CalendarOutlined />,
          label: 'Quản lý hoạt động'
        },
        {
          key: '/admin/feedback',
          icon: <StarOutlined />,
          label: 'Quản lý đánh giá'
        },
        {
          key: '/admin/skill',
          icon: <MonitorOutlined />,
          label: 'Quản lý kỹ năng'
        },
        {
          key: '/admin/organization',
          icon: <ClusterOutlined />,
          label: 'Quản lý ban tổ chức'
        },
        {
          key: '/admin/request-organization',
          icon: <PullRequestOutlined />,
          label: 'Quản lý yêu cầu/ban tổ chức'
        },
        {
          key: '/admin/faq',
          icon: <MonitorOutlined />,
          label: 'Quản lý FAQ'
        }
      ]
    }
  ];
  const menuOrganizer = [
    {
      key: '/',
      label: 'Trang chủ',
      icon: <HomeOutlined />
    },
    {
      key: '/organizer',
      icon: <AuditOutlined />,
      label: 'Ban tổ chức',
      children: [
        {
          key: '/profile',
          icon: <UserOutlined />,
          label: 'Thông tin cá nhân'
        },
        {
          key: '/change-password',
          label: 'Đổi mật khẩu',
          icon: <EditOutlined />
        },
        {
          key: '/organizer',
          icon: <DashboardFilled />,
          label: 'Dashboard'
        },
        {
          key: '/organizer/activities',
          icon: <CalendarOutlined />,
          label: 'Quản lý hoạt động'
        },
        {
          key: '/organizer/apply-activity',
          icon: <MonitorOutlined />,
          label: 'Quản lý yêu cầu/hoạt động'
        },
        {
          key: '/organizer/feedback',
          icon: <StarOutlined />,
          label: 'Quản lý đánh giá'
        },
        {
          key: '/organizer/request-volunteer',
          icon: <PullRequestOutlined />,
          label: 'Quản lý yêu cầu/tình nguyện viên'
        },
        {
          key: '/organizer/volunteers',
          icon: <UsergroupAddOutlined />,
          label: 'Quản lý tình nguyện viên'
        }
      ]
    }
  ];
  const menuVolunteer = [
    {
      key: '/',
      label: 'Trang chủ',
      icon: <HomeOutlined />
    },
    {
      key: '/volunteer',
      icon: <AuditOutlined />,
      label: 'Tình nguyện viên',
      children: [
        {
          key: '/profile',
          icon: <UserOutlined />,
          label: 'Thông tin cá nhân'
        },
        {
          key: '/change-password',
          label: 'Đổi mật khẩu',
          icon: <EditOutlined />
        },
        {
          key: '/volunteer',
          icon: <DashboardFilled />,
          label: 'Dashboard'
        },
        {
          key: '/volunteer/activities',
          icon: <MonitorOutlined />,
          label: 'Hoạt động'
        },
        {
          key: '/volunteer/join-organization',
          icon: <PullRequestOutlined />,
          label: 'Tham gia tổ chức'
        },
        {
          key: '/volunteer/request-organization',
          icon: <PullRequestOutlined />,
          label: 'Trở thành tổ chức'
        },
        {
          key: '/volunteer/your-organization',
          icon: <UsergroupAddOutlined />,
          label: 'Tổ chức của bạn'
        }
      ]
    }
  ];
  return (
    <Sider
      style={{ backgroundColor: token.colorBgBase }}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={250}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 32,
          margin: 16,
          background: token.colorBgBase,
          borderRadius: 5,
          cursor: 'pointer'
        }}
        onClick={() => router.push('/')}
      >
        {collapsed ? (
          <img
            style={{ maxWidth: 32, maxHeight: 32 }}
            alt='logo'
            src='/logo.png'
          />
        ) : (
          <>
            <Typography>HVMS Dashboard</Typography>
            <img
              style={{ maxWidth: 32, maxHeight: 32 }}
              alt='logo'
              src='/logo.png'
            />
          </>
        )}
      </div>
      <Menu
        style={{ backgroundColor: token.colorBgBase }}
        defaultSelectedKeys={[router.pathname]}
        mode='inline'
        items={
          user &&
          (+user?.role_id === 3
            ? menuAdmin
            : +user?.role_id === 2
              ? menuOrganizer
              : +user?.role_id === 1
                ? menuVolunteer
                : menuAdmin)
        }
        onClick={(menu) => {
          router.push(menu.key);
        }}
      />
    </Sider>
  );
};

export default SiderMenu;
