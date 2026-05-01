import { Modal } from 'antd';

const ModalComponent = ({
  isModalVisible,
  handleCancel,
  title,
  width,
  children,
  ...modalProps
}) => {
  return (
    <div>
      <Modal
        destroyOnClose
        title={title}
        open={isModalVisible}
        onCancel={handleCancel}
        width={width}
        footer={false}
        {...modalProps}
      >
        {children}
      </Modal>
    </div>
  );
};

export default ModalComponent
