import { Modal } from 'antd';

const ModalComponent = ({isModalVisible, handleCancel, title, width, children}) => {

    return (
        <div>
            
             <Modal destroyOnClose title={title} visible={isModalVisible}  onCancel={handleCancel}  width={width} footer={false}
              //  maskClosable={false}
              //  keyboard={false}
             >
               {children}
            </Modal>
        </div>
    )
}

export default ModalComponent
