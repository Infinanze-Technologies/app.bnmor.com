import React from 'react'
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Spin,
  Skeleton,
  Upload,
  message
} from "antd";
import { useState, useEffect } from 'react';
import ModalComponent from "@/components/ModalComponent";
import useHandleResponse from '@/hooks/useHandleResponse';
import useToastMessage from '@/hooks/useToastMessage';
import { getRequest, updateRequest } from "@/hooks/apiService";
import { URL_UPDATE_EMPLOYEE_DOCUMENT } from '@/config/api-paths';
import ViewDocument from './ViewDocument';
import CustomSelect from "@/components/form/CustomSelect";
import ImgCrop from 'antd-img-crop';

const toBase64 = file =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

function EditDocument(props) {
  let { session, SingleEmployeeDocumentData } = props
  let jwt = session?.jwt;
  let get_cutomer = SingleEmployeeDocumentData?.data?.data
  const [getTime, setGetTime] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalWidth, setModalWidth] = useState();
  const [modalContent, setModalContent] = useState("");

  const [fileType, setFileType] = useState('profile');
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  const { toastError } = useToastMessage();

  const handleChangeFile = (type) => {
    if (type === null) {
      setFileType('profile')
    } else {
      setFileType(type)
    }
  }

  let public_path = process.env.NEXT_PUBLIC_PUBLIC_IMAGES

  const handleProfilefile = async (e) => {
    const base64 = await toBase64(e.target.files[0]);

    try {
      if (fileType != 'profile')
        return toastError("Profile is required");

      let data = {
        file_type: fileType,
        file: base64
      }
      setGetTime(true)
      updateRequest(URL_UPDATE_EMPLOYEE_DOCUMENT, get_cutomer?.employee_id, { ...data }, jwt)
        .then((res) => {
          handleRequestResponse(res)
          SingleEmployeeDocumentData.refetchEntity()
          setTimeout(() => setGetTime(false), 8000);
        }).finally(() => {
          SingleEmployeeDocumentData.refetchEntity()
          setTimeout(() => setGetTime(false), 8000);
        })
        .catch((err) => {
          handleRequestError(err);
          setGetTime(false)
        });
    } catch (error) {
      setGetTime(false)
      console.log(error)
    }
  }

  const handleCertificatefile = async (e) => {
    const file = e.target.files[0];
    await toBase64(file)
      .then(result => {
        file["base64"] = result;
      })
      .catch(err => {
        console.log(err);
      });

    try {
      if (fileType != 'certificate')
        return toastError("Certificate is required");

      let data = {
        file_type: fileType,
        file: file['base64']
      }
      setGetTime(true)
      updateRequest(URL_UPDATE_EMPLOYEE_DOCUMENT, get_cutomer?.employee_id, { ...data }, jwt)
        .then((res) => {
          handleRequestResponse(res)
          SingleEmployeeDocumentData.refetchEntity()
          setTimeout(() => setGetTime(false), 8000);
        }).finally(() => {
          SingleEmployeeDocumentData.refetchEntity()
          setTimeout(() => setGetTime(false), 8000);
        })
        .catch((err) => {
          handleRequestError(err);
          setGetTime(false)
        });
    } catch (error) {
      console.log(error)
      setGetTime(false)
    }
  }

  const handleResumefile = async (e) => {
    const file = e.target.files[0];
    await toBase64(file)
      .then(result => {
        file["base64"] = result;
      })
      .catch(err => {
        console.log(err);
      });

    try {
      if (fileType != 'resume')
        return toastError("Resume is required");

      let data = {
        file_type: fileType,
        file: file['base64']
      }
      setGetTime(true)
      updateRequest(URL_UPDATE_EMPLOYEE_DOCUMENT, get_cutomer?.employee_id, { ...data }, jwt)
        .then((res) => {
          handleRequestResponse(res)
          SingleEmployeeDocumentData.refetchEntity()
          setTimeout(() => setGetTime(false), 8000);
        }).finally(() => {
          SingleEmployeeDocumentData.refetchEntity()
          setTimeout(() => setGetTime(false), 8000);
        })
        .catch((err) => {
          handleRequestError(err);
          setGetTime(false)
        });
    } catch (error) {
      console.log(error)
      setGetTime(false)
    }
  }

  useEffect(() => {
    // Any side effects
  }, [props, public_path, fileType]);

  const showModal = (value, record) => {
    if (value == "view") {
      setIsModalVisible(true);
      setModalTitle(<ViewDocumentTitle />);
      setModalWidth(800);
      setModalContent(
        <ViewDocument
          setIsModalVisible={setIsModalVisible}
          record={record}
          fileType={fileType}
        />
      );
    } else {
      return false;
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const ViewDocumentTitle = () => (
    <div className="flex flex-wrap" style={{ width: 700 }}>
      <h6>View File</h6>
    </div>
  );

  // Prepare options for custom select
  const documentTypeOptions = [
    { value: 'profile', label: 'Profile' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'resume', label: 'Resume' }
  ];

  return (
    <>
      <div style={{ 
        maxWidth: 800, 
        margin: "0 auto", 
        padding: 24
      }}>
        <Card
          title={<span style={{ fontSize: 20, fontWeight: 600, color: "#2a3f54" }}>Edit Employee Documents</span>}
          bordered={false}
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <CustomSelect
                label="Select Document Type"
                name="file_type"
                options={documentTypeOptions}
                placeholder="Select Document Type"
                selectProps={{
                  onChange: handleChangeFile,
                  defaultValue: "profile"
                }}
              />
            </Col>
          </Row>

          {/* Profile Document Section */}
          {fileType == 'profile' && (
            <Card type="inner" title="Profile Photo" style={{ marginTop: 24, borderRadius: 8 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  {SingleEmployeeDocumentData?.loading === true ? (
                    <Skeleton />
                  ) : (
                    <div className="form-group">
                      <label className="col-form-label">
                        Upload New Profile Photo <span className="text-danger">*</span>
                      </label>
                      <Form.Item>
                        <input
                          className="form-control"
                          type="file"
                          accept="image/webp,image/jpeg,image/png,image/jpg"
                          onChange={handleProfilefile}
                        />
                      </Form.Item>
                    </div>
                  )}
                </Col>
                <Col xs={24}>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      disabled={getTime}
                      type="primary"
                      size="large"
                      onClick={() => showModal("view", get_cutomer)}
                      style={{
                        borderRadius: '8px',
                        height: '48px',
                        padding: '0 32px',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      {getTime ? 'Preparing File For Preview' : 'View Employee Profile'}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>
          )}

          {/* Certificate Document Section */}
          {fileType == 'certificate' && (
            <Card type="inner" title="Certificate Document" style={{ marginTop: 24, borderRadius: 8 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  {SingleEmployeeDocumentData?.loading === true ? (
                    <Skeleton />
                  ) : (
                    <div className="form-group">
                      <label className="col-form-label">
                        Upload New Certificate <span className="text-danger">*</span>
                      </label>
                      <Form.Item>
                        <input
                          className="form-control"
                          type="file"
                          accept=".pdf"
                          onChange={handleCertificatefile}
                        />
                      </Form.Item>
                    </div>
                  )}
                </Col>
                <Col xs={24}>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      disabled={getTime}
                      type="primary"
                      size="large"
                      onClick={() => showModal("view", get_cutomer)}
                      style={{
                        borderRadius: '8px',
                        height: '48px',
                        padding: '0 32px',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      {getTime ? 'Preparing File For Preview' : 'View Employee Certificate File'}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>
          )}

          {/* Resume Document Section */}
          {fileType == 'resume' && (
            <Card type="inner" title="Resume Document" style={{ marginTop: 24, borderRadius: 8 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24}>
                  {SingleEmployeeDocumentData?.loading === true ? (
                    <Skeleton />
                  ) : (
                    <div className="form-group">
                      <label className="col-form-label">
                        Upload New Resume <span className="text-danger">*</span>
                      </label>
                      <Form.Item>
                        <input
                          className="form-control"
                          type="file"
                          accept=".pdf"
                          onChange={handleResumefile}
                        />
                      </Form.Item>
                    </div>
                  )}
                </Col>
                <Col xs={24}>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      disabled={getTime}
                      type="primary"
                      size="large"
                      onClick={() => showModal("view", get_cutomer)}
                      style={{
                        borderRadius: '8px',
                        height: '48px',
                        padding: '0 32px',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      {getTime ? 'Preparing File For Preview' : 'View Employee Resume File'}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card>
          )}
        </Card>
      </div>

      <ModalComponent
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        title={modalTitle}
        width={modalWidth}
      >
        {modalContent}
      </ModalComponent>
    </>
  )
}

export default EditDocument