import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, message, Steps } from 'antd';
import Head from 'next/head';
import FormCreateOrganization from '@/components/request_organization/FormCreateOrganization';
import { useAppSelector } from '@/hooks/useRedux';
import { useMutation, useQuery } from 'react-query';
import { organizationService } from '@/services/organization.service';
import DashboardLayout from '../../../shared/layouts/DashboardLayout';

const RequestOrganization = () => {
  const { inforOrganization } = useAppSelector((state) => state.appSlice);
  const {data: dataMyOrganization} = useQuery(['myOrganization'], () => organizationService.getMyOrganization())  
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if(dataMyOrganization) {
      setCurrent(1);
    }
  }, [dataMyOrganization]); 
  console.log(inforOrganization);
  
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const requestBecomeOrganizationMutation = useMutation({
    mutationKey: 'requestBecomeOrganizationMutation',
    mutationFn: (body: { organization_id: number }) =>
      organizationService.requestBecomeOrganization(body),
    onSuccess(data, _variables, _context) {
      if (data) {
        message.success('Yêu cầu thành công');
      }
    },
    onError(error, variables, context) {
      message.error('Yêu cầu không thành công');
    }
  });

  function handleRequest() {
    requestBecomeOrganizationMutation.mutate({
      organization_id: inforOrganization!.id
    });
  }
  const steps = [
    {
      title: 'Thông tin tổ chức',
      content: (
        <>
          <FormCreateOrganization next={next} />
        </>
      )
    },
    {
      title: 'Đơn đăng ký',
      content: (
        <>
          <Form
            name='basic'
            initialValues={{ remember: true }}
            onFinish={handleRequest}
            autoComplete='off'
            layout='vertical'
          >
            <h2>Tên tổ chức: {dataMyOrganization?.data.data.organization.name}</h2>
            <h3>Địa chỉ: {dataMyOrganization?.data.data.organization.location}</h3>
            <h3>Mô tả:</h3>
            <span style={{ whiteSpace: 'pre-line' }}>
              {dataMyOrganization?.data.data.organization.description}
            </span>
            <Form.Item
              name='remember'
              valuePropName='checked'
              className='m-0 p-0'
            >
              <Checkbox>Ghi nhớ điều khoản</Checkbox>
            </Form.Item>
            <Form.Item style={{ textAlign: 'center' }}>
              <Button
                type='primary'
                htmlType='submit'
                loading={requestBecomeOrganizationMutation.isLoading}
              >
                Gửi yêu cầu
              </Button>
            </Form.Item>
          </Form>
        </>
      )
    }
  ];
  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  return (
    <React.Fragment>
      <Head>
        <title>Đăng ký tổ chức</title>
      </Head>
      <Steps current={current} items={items} />
      <div className='w-full min-h-[50vh] bg-slate-300 mt-10 p-10 rounded-lg'>
        {steps[current].content}
      </div>
      <div style={{ marginTop: 24 }}>
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Quay lại
          </Button>
        )}
      </div>
    </React.Fragment>
  );
};
RequestOrganization.getLayout = (children: React.ReactNode) => (
  <DashboardLayout>{children}</DashboardLayout>
);
export default RequestOrganization;
