import React from 'react';
import {
  Modal,
  Button,
  Typography,
  Descriptions,
  Tag,
  Divider,
  Row,
  Col,
  Space,
  Image,
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import {
  formatDateHuman,
  formatDateTime,
} from '@/config/DateFormat';

const { Text, Title } = Typography;

const dash = (v) => {
  if (v === null || v === undefined || v === '') return '—';
  return String(v);
};

const ViewProperty = ({ visible, onCancel, record }) => {
  if (!record) return null;

  const entity = record.entity;
  const category = record.category;
  const subcategory = record.subcategory;
  const statusLabel = record.statuses;
  const region = record.region;
  const district = record.district;
  const area = record.area;
  const amenities = Array.isArray(record.amenities) ? record.amenities : [];
  const images = Array.isArray(record.images) ? record.images : [];

  const locationDisplay = [region?.name, district?.name, area?.name]
    .filter(Boolean)
    .join(' / ');

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EyeOutlined style={{ color: '#1890ff' }} />
          <span>Property details</span>
          {category?.name && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {category.name}
            </Tag>
          )}
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={980}
      style={{ top: 20 }}
      bodyStyle={{
        maxHeight: 'calc(85vh - 140px)',
        overflowY: 'auto',
        paddingTop: 8,
      }}
      footer={
        <Button type="primary" onClick={onCancel}>
          Close
        </Button>
      }
    >
      <Title level={5} style={{ marginTop: 0, marginBottom: 16 }}>
        {dash(record.title)}
      </Title>

      <Descriptions bordered size="small" column={{ xs: 1, sm: 1, md: 2 }} layout="horizontal">
        <Descriptions.Item label="ID">{dash(record.id)}</Descriptions.Item>
        <Descriptions.Item label="UUID" span={2}>
          <Text copyable={{ text: record.uuid }}>{dash(record.uuid)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Record status">
          <Tag color={record.status !== false ? 'success' : 'default'}>
            {record.status !== false ? 'Active' : 'Inactive'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Listing status">
          {dash(statusLabel?.name)}
        </Descriptions.Item>
        <Descriptions.Item label="Created">
          {record.created_at ? formatDateTime(record.created_at) : '—'}
        </Descriptions.Item>
        <Descriptions.Item label="Updated">
          {record.updated_at ? formatDateTime(record.updated_at) : '—'}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Classification</Divider>
      <Descriptions bordered size="small" column={{ xs: 1, md: 2 }}>
        <Descriptions.Item label="Category">{dash(category?.name)}</Descriptions.Item>
        <Descriptions.Item label="Subcategory">{dash(subcategory?.name)}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Location</Divider>
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Location">
          {locationDisplay || '—'}
        </Descriptions.Item>
      </Descriptions>

      {entity && (
        <>
          <Divider orientation="left">Entity</Divider>
          <Descriptions bordered size="small" column={{ xs: 1, md: 2 }}>
            <Descriptions.Item label="Name">{dash(entity.name)}</Descriptions.Item>
            <Descriptions.Item label="Email">{dash(entity.email)}</Descriptions.Item>
            <Descriptions.Item label="Phone">
              {dash(entity.phone)}
            </Descriptions.Item>
            <Descriptions.Item label="Alternative Number">
              {dash(entity.alternative_number)}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}

      <Divider orientation="left">Pricing & details</Divider>
      <Descriptions bordered size="small" column={{ xs: 1, md: 2 }}>
        <Descriptions.Item label="Price">{dash(record.price)}</Descriptions.Item>
        <Descriptions.Item label="Land size">{dash(record.land_size)}</Descriptions.Item>
        <Descriptions.Item label="Bedrooms">{dash(record.bedrooms)}</Descriptions.Item>
        <Descriptions.Item label="Bathrooms">{dash(record.bathrooms)}</Descriptions.Item>
        <Descriptions.Item label="Size (sq ft)">{dash(record.size)}</Descriptions.Item>
        <Descriptions.Item label="Furnished">
          {record.furnished === true ? (
            <Tag color="green">Yes</Tag>
          ) : record.furnished === false ? (
            <Tag>No</Tag>
          ) : (
            '—'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Budget">{dash(record.budget)}</Descriptions.Item>
        <Descriptions.Item label="Contractor">{dash(record.contractor)}</Descriptions.Item>
        <Descriptions.Item label="Project start">
          {record.start_date ? formatDateHuman(record.start_date) : '—'}
        </Descriptions.Item>
        <Descriptions.Item label="Project end">
          {record.end_date ? formatDateHuman(record.end_date) : '—'}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Amenities</Divider>
      {amenities.length > 0 ? (
        <Space wrap size={[8, 8]}>
          {amenities.map((a) => (
            <Tag key={a}>{a}</Tag>
          ))}
        </Space>
      ) : (
        <Text type="secondary">—</Text>
      )}

      <Divider orientation="left">Description</Divider>
      {record.description ? (
        <div
          className="property-html-description"
          style={{
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            padding: 12,
            background: '#fafafa',
            maxHeight: 240,
            overflow: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: record.description }}
        />
      ) : (
        <Text type="secondary">—</Text>
      )}

      <Divider orientation="left">Images ({images.length})</Divider>
      {images.length > 0 ? (
        <Image.PreviewGroup>
          <Row gutter={[12, 12]}>
            {images.map((img, idx) => (
              <Col xs={12} sm={8} md={6} key={img.id ?? idx}>
                <Image
                  alt={record.title ? `${record.title} ${idx + 1}` : `Image ${idx + 1}`}
                  src={img.image_url}
                  style={{ borderRadius: 8, width: '100%', objectFit: 'cover' }}
                  height={140}
                  placeholder
                />
              </Col>
            ))}
          </Row>
        </Image.PreviewGroup>
      ) : (
        <Text type="secondary">No images</Text>
      )}
    </Modal>
  );
};

export default ViewProperty;
