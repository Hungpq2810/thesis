import {
  ContactsOutlined,
  QuestionCircleOutlined,
  ExpandAltOutlined,
  UserOutlined,
  GroupOutlined,
  SearchOutlined,
  FacebookOutlined,
  GooglePlusOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  SkypeOutlined,
  TwitterOutlined,
  YoutubeOutlined
} from '@ant-design/icons';
import { Button, Col, Input, Layout, Menu, MenuProps, Row, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Search from 'antd/lib/input/Search';
import { useAppSelector } from '@/hooks/useRedux';
import { deleteCookie, getCookie } from 'cookies-next';
import { APP_SAVE_KEYS } from '@/constant/AppConstant';
import { useDispatch } from 'react-redux';
import { login } from '@/store/appSlice';
import jwt_decode from 'jwt-decode';
import DashboardLayout from './DashboardLayout';
import FooterContent from './components/FooterContent';
import { Link } from 'react-router-dom';

const { Header, Content, Footer } = Layout;

function BlankLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.appSlice);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();
  const [current, setCurrent] = useState('');
  const router = useRouter();
  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    window.location.href = `/${e.key}`;
  };
  const handleLogout = () => {
    deleteCookie(APP_SAVE_KEYS.KEYS);
    deleteCookie(APP_SAVE_KEYS.ROLE);
    router.push('/login');
    window.location.reload();
  };
  const APP_WEBSITE_MENU: MenuProps['items'] = [
    {
      label: 'Hoạt động',
      key: 'activity',
      icon: <ContactsOutlined />
    },
    {
      label: 'Ban tổ chức',
      key: 'organization',
      icon: <GroupOutlined />
    },
    {
      label: 'Về chúng tôi',
      key: 'about-us',
      icon: <ExpandAltOutlined />
    },
    {
      label: 'Feedback',
      key: 'feedback',
      icon: <QuestionCircleOutlined />
    },
    {
      label: 'FAQ',
      key: 'faq',
      icon: <QuestionCircleOutlined />
    }
  ];
  useEffect(() => {
    const key = getCookie(APP_SAVE_KEYS.KEYS);
    const role = getCookie(APP_SAVE_KEYS.ROLE);
    if (typeof key === 'string' && role) {
      const decodeData: any = jwt_decode(key);
      setIsLoggedIn(true);
      dispatch(
        login({
          role_id: decodeData.role_id,
          username: decodeData.username,
          id: decodeData.id,
          avatar: decodeData.avatar,
          name: decodeData.name,
          email: decodeData.email
        })
      );
    }
  }, []);
  const handleSearch = (value: string) => {
    router.push(`/activity?key=${value}`);
  };

  return (
    <React.Fragment>
      <Header className='flex justify-between items-center bg-[#fff]'>
        <div className='text-2xl px-4 cursor-pointer'>
          <img width={100} onClick={() => router.push('/')} src='/logo.svg' />
        </div>
        <div className='w-full grid grid-cols-5 justify-start items-center gap-2'>
          <Menu
            className='col-span-2 border-none'
            theme='light'
            onClick={onClick}
            selectedKeys={[current]}
            mode='horizontal'
            items={APP_WEBSITE_MENU}
          />
          <Input.Search
            style={{ display: 'flex', margin: '0 auto' }}
            placeholder={`Tìm kiếm...`}
            allowClear
            enterButton={<SearchOutlined />}
            size='large'
            onSearch={(value) => handleSearch(value)}
          />
          <div className='col-span-2 w-full flex justify-end items-center gap-4'>
            {user && <UserOutlined onClick={() => router.push('/profile')} />}
            {!user && (
              <Button onClick={() => router.push('/login')}>Đăng nhập</Button>
            )}
            {user && Number(user?.role_id) === 3 && (
              <Button onClick={() => router.push('/admin/user')}>ADMIN</Button>
            )}
            {user && Number(user?.role_id) === 2 && (
              <Button onClick={() => router.push('/organizer/activities')}>
                TỔ CHỨC
              </Button>
            )}
            {user && Number(user?.role_id) === 1 && (
              <Button onClick={() => router.push('/volunteer/activities')}>
                TÌNH NGUYỆN VIÊN
              </Button>
            )}
            {user && <Button onClick={() => handleLogout()}>Đăng xuất</Button>}
          </div>
        </div>
      </Header>
      <Content className='w-full min-h-[100vh] flex flex-col justify-center items-center mx-auto p-20'>
        {children}
      </Content>
      <Footer className='w-full'>
        
        <Row
          className='flex'
          justify='space-around'
          align='middle'
          style={{ backgroundColor: '#f0f2f5', padding: '20px 0' }}
        >
          <Col style={{ textAlign: 'center' }}>
            <div className='text-2xl px-4 cursor-pointer'>
              <img width={300} onClick={() => router.push('/')} src='/logo.svg' />
            </div>
          </Col>

          <Col >
            <h3 className='text-xl px-4 cursor-pointer'>

            <FacebookOutlined /> <a href="https://www.facebook.com/tinhnguyen.bachkhoa">Tình nguyện Bách Khoa</a>
            <br />
            <YoutubeOutlined /> <a href="https://www.youtube.com/@tinhnguyenict">Đội tình nguyện trường CNTT&TT</a>
            </h3>
          
          </Col>
        
          <Col >
            <p className='text-xl px-4'>SĐT liên hệ: 0886055886</p>
            <p className='text-xl px-4'>Địa chỉ: Đại học Bách Khoa Hà Nội</p>
            <p className='text-xl px-4'>Email: <a>hungphiquoc@gmail.com</a> </p>
          </Col>
        </Row>
      </Footer>
    </React.Fragment>
  );
}
BlankLayout.getLayout = (children: React.ReactNode) => (
  <DashboardLayout>{children}</DashboardLayout>
);
export default BlankLayout;
