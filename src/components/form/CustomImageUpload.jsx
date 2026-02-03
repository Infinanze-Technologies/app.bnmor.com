import React, { useState, useCallback } from 'react';
import { Form, Upload, Modal, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Cropper from 'react-easy-crop';

const getCroppedImg = async (imageSrc, crop, zoom, aspect) => {
  // Utility to crop image using canvas
  const createImage = url =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      blob.name = 'cropped.jpeg';
      const fileUrl = window.URL.createObjectURL(blob);
      resolve({ blob, fileUrl });
    }, 'image/jpeg');
  });
};

const CustomImageUpload = ({
  label,
  name,
  rules,
  aspect = 1,
  placeholder = 'Click or drag file to this area to upload',
  ...rest
}) => {
  const [fileList, setFileList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isJpgOrPng) {
      Modal.error({ title: 'You can only upload JPG/PNG/WEBP files!' });
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      Modal.error({ title: 'Image must be smaller than 2MB!' });
      return Upload.LIST_IGNORE;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result);
      setModalVisible(true);
    };
    return false; // Prevent upload
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropOk = async () => {
    const { blob, fileUrl } = await getCroppedImg(imageSrc, croppedAreaPixels, zoom, aspect);
    const newFile = new File([blob], 'cropped.jpeg', { type: 'image/jpeg' });
    setFileList([
      {
        uid: '-1',
        name: 'cropped.jpeg',
        status: 'done',
        url: fileUrl,
        originFileObj: newFile,
      },
    ]);
    setCroppedImage(fileUrl);
    setModalVisible(false);
  };

  const handleRemove = () => {
    setFileList([]);
    setCroppedImage(null);
  };

  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      valuePropName="fileList"
      getValueFromEvent={() => fileList}
      {...rest.formItemProps}
    >
      <Upload.Dragger
        accept="image/jpeg,image/png,image/webp"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onRemove={handleRemove}
        listType="picture-card"
        showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
        {...rest.uploadProps}
      >
        {fileList.length < 1 ? (
          <>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>{placeholder}</div>
          </>
        ) : null}
      </Upload.Dragger>
      <Modal
        open={modalVisible}
        title="Crop Image"
        onOk={handleCropOk}
        onCancel={() => setModalVisible(false)}
        okText="Crop"
        width={400}
        destroyOnClose
      >
        {imageSrc && (
          <div style={{ position: 'relative', width: '100%', height: 300, background: '#333' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}
      </Modal>
    </Form.Item>
  );
};

export default CustomImageUpload; 