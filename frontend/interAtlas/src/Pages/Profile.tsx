import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/Globalcontext';
import {
  Row,
  Col,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Spin,
  Modal,
  Progress,
  Alert,
  DatePicker
} from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export interface AttachmentSite {
  companyName: string;
  coordinates: number[]; // [latitude, longitude]
  supervisorName: string;
  supervisorContact: string;
  startDate: string;
  endDate: string;
  nearbyTown?: string;
  specificPlace?: string;
}

export interface UserProfile {
  name: string;
  studentId: string;
  email: string;
  phone: string;
  attachmentSite: AttachmentSite;
}

const Profile: React.FC = () => {
  const { user } = useGlobalContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [updatedProfile, setUpdatedProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>('');

  const computeProfileCompletion = (): number => {
    if (!profile) return 0;
    let totalFields = 0;
    let filledFields = 0;
    const topFields: Array<keyof Omit<UserProfile, 'attachmentSite'>> = ['name', 'studentId', 'email', 'phone'];
    totalFields += topFields.length;
    topFields.forEach(field => {
      if (profile[field]?.trim()) filledFields++;
    });
    const attachmentFields: Array<keyof AttachmentSite> = [
      'companyName',
      'coordinates',
      'supervisorName',
      'supervisorContact',
      'startDate',
      'endDate',
      'nearbyTown',
      'specificPlace'
    ];
    totalFields += attachmentFields.length;
    attachmentFields.forEach(field => {
      const value = profile.attachmentSite[field];
      if (typeof value === 'string' && value.trim()) {
        filledFields++;
      } else if (Array.isArray(value) && value.length === 2 && value.every(v => typeof v === 'number')) {
        filledFields++;
      }
    });
    return Math.round((filledFields / totalFields) * 100);
  };

  useEffect(() => {
    if (!user) {
      setError('User must be logged in to view profile');
    }
  }, [user]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/profile');
        const data: UserProfile = await response.json();
        setProfile(data);
        setUpdatedProfile(data);
      } catch {
        setError('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field: string, value: string, nested = false) => {
    if (!updatedProfile) return;
    if (nested) {
      setUpdatedProfile(prev => ({
        ...prev!,
        attachmentSite: {
          ...prev!.attachmentSite,
          [field]: value,
        },
      }));
    } else {
      setUpdatedProfile(prev => ({ ...prev!, [field]: value }));
    }
  };

  const handleCoordinateChange = (index: 0 | 1, value: string) => {
    const numberValue = parseFloat(value);
    if (!updatedProfile || isNaN(numberValue)) return;
    const coords = [...updatedProfile.attachmentSite.coordinates];
    coords[index] = numberValue;
    setUpdatedProfile(prev => ({
      ...prev!,
      attachmentSite: { ...prev!.attachmentSite, coordinates: coords },
    }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: dayjs.Dayjs | null) => {
    if (!updatedProfile || !date) return;
    handleChange(field, date.format('YYYY-MM-DD'), true);
  };

  const handleUpdate = async () => {
    if (!password) {
      setDialogMessage('Please enter your password to confirm changes.');
      setDialogOpen(true);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedProfile, password }),
      });
      if (response.ok) {
        setProfile(updatedProfile);
        setEditMode(false);
        setPassword('');
        setDialogMessage('Profile updated successfully!');
      } else {
        setDialogMessage('Profile update failed. Please check your password.');
      }
    } catch {
      setDialogMessage('An error occurred while updating profile.');
    } finally {
      setLoading(false);
      setDialogOpen(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '16px', background: '#f0f2f5', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card style={{ width: '100%', maxWidth: 1000 }} bordered={false}>
        {/* Header Section */}
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography.Title level={4} style={{ margin: 0 }}>Your Profile</Typography.Title>
          <Button type="primary" icon={editMode ? <SaveOutlined /> : <EditOutlined />} onClick={() => (editMode ? handleUpdate() : setEditMode(true))}>
            {editMode ? 'Save' : 'Edit'}
          </Button>
        </div>

        {error && <Alert message={error} type="error" showIcon style={{ margin: '16px' }} />}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Profile Completion */}
            <div style={{ padding: '16px' }}>
              <Typography.Text strong>
                Profile Completion: {computeProfileCompletion()}%
              </Typography.Text>
              <Progress percent={computeProfileCompletion()} status="active" style={{ marginTop: '8px' }} />
            </div>

            {/* Top Section */}
            <Row gutter={[16, 16]} style={{ padding: '16px' }}>
              <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                <UserOutlined style={{ fontSize: '64px', color: '#8c8c8c' }} />
                <Typography.Title level={5} style={{ marginTop: '8px' }}>
                  {profile?.name || 'N/A'}
                </Typography.Title>
                <Typography.Text type="secondary">
                  Student ID: {profile?.studentId || 'N/A'}
                </Typography.Text>
              </Col>
              <Col xs={24} md={16}>
                <Form layout="vertical">
                  <Form.Item label="Full Name">
                    <Input
                      value={updatedProfile?.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      disabled={!editMode}
                    />
                  </Form.Item>
                  <Form.Item label="Email">
                    <Input value={updatedProfile?.email || ''} disabled />
                  </Form.Item>
                  <Form.Item label="Phone Number">
                    <Input
                      value={updatedProfile?.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      disabled={!editMode}
                    />
                  </Form.Item>

                  {editMode && (
                    <Form.Item label="Password" required>
                      <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password to save changes"
                      />
                    </Form.Item>
                  )}
                </Form>
              </Col>
            </Row>

            {/* Divider */}
            <div style={{ padding: '0 16px', borderBottom: '1px solid #f0f0f0', marginBottom: '16px' }} />

            {/* Attachment Details */}
            <div style={{ padding: '16px' }}>
              <Typography.Text strong style={{ display: 'block', marginBottom: '8px' }}>
                Attachment Details
              </Typography.Text>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form layout="vertical">
                    <Form.Item label="Company Name">
                      <Input
                        value={updatedProfile?.attachmentSite.companyName || ''}
                        onChange={(e) => handleChange('companyName', e.target.value, true)}
                        disabled={!editMode}
                      />
                    </Form.Item>
                    <Form.Item label="Supervisor Name">
                      <Input
                        value={updatedProfile?.attachmentSite.supervisorName || ''}
                        onChange={(e) => handleChange('supervisorName', e.target.value, true)}
                        disabled={!editMode}
                      />
                    </Form.Item>
                    <Form.Item label="Supervisor Contact">
                      <Input
                        value={updatedProfile?.attachmentSite.supervisorContact || ''}
                        onChange={(e) => handleChange('supervisorContact', e.target.value, true)}
                        disabled={!editMode}
                      />
                    </Form.Item>
                  </Form>
                </Col>
                <Col xs={24} md={12}>
                  <Form layout="vertical">
                    <Form.Item label="Start Date">
                      <DatePicker
                        value={updatedProfile?.attachmentSite.startDate ? dayjs(updatedProfile.attachmentSite.startDate) : null}
                        onChange={(date) => handleDateChange('startDate', date)}
                        disabled={!editMode}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    <Form.Item label="End Date">
                      <DatePicker
                        value={updatedProfile?.attachmentSite.endDate ? dayjs(updatedProfile.attachmentSite.endDate) : null}
                        onChange={(date) => handleDateChange('endDate', date)}
                        disabled={!editMode}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
            </div>

            {/* Location Details */}
            <div style={{ padding: '16px' }}>
              <Typography.Text strong style={{ display: 'block', marginBottom: '8px' }}>
                Location Details
              </Typography.Text>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form layout="vertical">
                    <Form.Item label="Latitude">
                      <Input
                        value={updatedProfile?.attachmentSite.coordinates[0]?.toString() || ''}
                        onChange={(e) => handleCoordinateChange(0, e.target.value)}
                        disabled={!editMode}
                      />
                    </Form.Item>
                  </Form>
                </Col>
                <Col xs={24} sm={12}>
                  <Form layout="vertical">
                    <Form.Item label="Longitude">
                      <Input
                        value={updatedProfile?.attachmentSite.coordinates[1]?.toString() || ''}
                        onChange={(e) => handleCoordinateChange(1, e.target.value)}
                        disabled={!editMode}
                      />
                    </Form.Item>
                  </Form>
                </Col>
                <Col xs={24}>
                  <Form layout="vertical">
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <Form.Item label="Nearby Town" style={{ flex: 1 }}>
                        <Input
                          value={updatedProfile?.attachmentSite.nearbyTown || ''}
                          onChange={(e) => handleChange('nearbyTown', e.target.value, true)}
                          disabled={!editMode}
                        />
                      </Form.Item>
                      <Form.Item label="Specific Place" style={{ flex: 1 }}>
                        <Input
                          value={updatedProfile?.attachmentSite.specificPlace || ''}
                          onChange={(e) => handleChange('specificPlace', e.target.value, true)}
                          disabled={!editMode}
                        />
                      </Form.Item>
                    </div>
                  </Form>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Card>

      <Modal
        title="Profile Update"
        open={dialogOpen}
        onOk={() => setDialogOpen(false)}
        onCancel={() => setDialogOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setDialogOpen(false)}>
            Close
          </Button>,
        ]}
      >
        <Typography.Text>{dialogMessage}</Typography.Text>
      </Modal>
    </div>
  );
};

export default Profile;
