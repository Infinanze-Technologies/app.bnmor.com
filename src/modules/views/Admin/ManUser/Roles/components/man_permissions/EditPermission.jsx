import { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Divider } from "antd";
import { URL_UPDATE_PERMISSIONS } from "@/config/api-paths";
import _ from "lodash";
import useEditPermission from "@/store/EditPermissionStore";
import { updateRequest } from "@/hooks/apiService";
import useHandleResponse from "@/hooks/useHandleResponse";
const CheckboxGroup = Checkbox.Group;
function EditPermission(props) {
    const { record,RoleWithPermissionsDataObject,jwt } =
        props;

    const { Permz, loading } = useEditPermission((state) => state)
    const { handleRequestError,handleRequestResponse} = useHandleResponse()
      console.log(Permz);

    const [form] = Form.useForm();
    const [isloadingSubmit, setIsloadingSubmit] = useState(false);

    // Get All Active Permission On Role
    const defaultCheckedList = record?.permissions?.map((element) => {
        return element.id;
    });

    // Get All Permisiion Id Under Users
    const UserId = Permz?.Users?.map((item) => {return item.id});
    // Check If has User ID
    const hasUser = UserId?.filter((value) => defaultCheckedList.includes(value));

    // Get All Permisiion Id Under Members
    const MemberId = Permz?.Members?.map((item) => {return item.id});
    // Check If has Members ID
    const hasMember = MemberId?.filter((value) => defaultCheckedList.includes(value));

    // Get All Permisiion Id Under Attributes
    const AttributesId = Permz?.Attributes?.map((item) => {return item.id});
    // Check If has Attributes ID
    const hasAttributesId = AttributesId.filter((value) => defaultCheckedList.includes(value));

    // Get All Permisiion Id Under Books
    const BooksId = Permz?.Books?.map((item) => {return item.id});
    // Check If has Books ID
    const hasBooksId = BooksId.filter((value) => defaultCheckedList.includes(value));

    // Get All Permisiion Id Under Request
    const RequestId = Permz?.BookRequest?.map((item) => {return item.id});
    // Check If has Request ID
    const hasRequestId = RequestId?.filter((value) => defaultCheckedList.includes(value));


    // Get All Permisiion Id Under Circulations
    const CirculationsId = Permz?.Circulations?.map((item) => {return item.id});
    // Check If has Circulations Id ID
    const hasCirculationsId = CirculationsId.filter((value) => defaultCheckedList.includes(value));

    // Get All Permisiion Id Under Role
    const RoleId = Permz?.Roles?.map((item) => {return item.id});
    // Check If has Role ID
    const hasRole = RoleId.filter((value) => defaultCheckedList.includes(value));

    // Get All Permisiion Id Under SettingsId
    const SettingsId = Permz?.Settings?.map((item) => {return item.id})
    // Check If has Settings ID
    const hasSettings = SettingsId.filter(value => defaultCheckedList.includes(value))




    useEffect(() => {
        form.setFieldsValue({
            ...record,
            name: record?.name,
            users: [...hasUser],
            members: [...hasMember],
            attributes: [...hasAttributesId],
            books: [...hasBooksId],
            role: [...hasRole],
            requests: [...hasRequestId],
            settings: [...hasSettings],
            circulations: [...hasCirculationsId]
        });
    }, [record]);

    //   console.log(UserId)
    //   console.log(defaultCheckedList)
    //   console.log(detect)

    // Get All Permisiion Under User
    const UserOptions = Permz?.Users?.map(
        (item) => {
            return { label: item.name, value: item.id };
        }
    );
    const [checkedUserList, setCheckedUserList] = useState(hasUser);
    const [UserIndeterminate, setUserIndeterminate] = useState(true);
    const [checkAllUser, setCheckAllUser] = useState(false);
    const onChangeUser = (list) => {
        setCheckedUserList(list);
        setUserIndeterminate(!!list.length && list.length < UserOptions.length);
        setCheckAllUser(list.length === UserOptions.length);
    };
    const onCheckAllChangeUser = (e) => {
        setCheckedUserList(e.target.checked ? UserOptions : []);
        setUserIndeterminate(false);
        setUserIndeterminate(e.target.checked);
    };

    // Get All Permisiion Under Member
    const MemberOptions = Permz?.Members?.map(
        (item) => {
            return { label: item.name, value: item.id };
        }
    );
    const [checkedMemberList, setCheckedMemberList] = useState(hasMember);
    const [MemberIndeterminate, setMemberIndeterminate] = useState(true);
    const [checkAllMember, setCheckAllMember] = useState(false);
    const onChangeMember = (list) => {
        setCheckedMemberList(list);
        setMemberIndeterminate(
            !!list.length && list.length < MemberOptions.length
        );
        setCheckAllMember(list.length === MemberOptions.length);
    };
    const onCheckAllChangeMember = (e) => {
        setCheckedMemberList(e.target.checked ? MemberOptions : []);
        setMemberIndeterminate(false);
        setMemberIndeterminate(e.target.checked);
    };

 // Get All Permisiion Under Attributess
const Attributes = Permz?.Attributes?.map(
    (item) => {
        return { label: item.name, value: item.id };
    }
);
const [checkedAttributesList, setCheckedAttributesList] = useState(hasAttributesId);
const [AttributesIndeterminate, setAttributesIndeterminate] = useState(true);
const [checkAllAttributes, setCheckAllAttributes] = useState(false);
const onChangeProduct = (list) => {
    setCheckedAttributesList(list);
    setAttributesIndeterminate(
        !!list.length && list.length < Attributes.length
    );
    setCheckAllAttributes(list.length === Attributes.length);
};
const onCheckAllChangeAttributes = (e) => {
    setCheckedAttributesList(e.target.checked ? Attributes : []);
    setAttributesIndeterminate(false);
    setAttributesIndeterminate(e.target.checked);
};

    // Get All Permisiion Under Book
    const BookOptions = Permz?.Books?.map(
        (item) => {
            return { label: item.name, value: item.id };
        }
    );
    const [checkedBookList, setCheckedBookList] = useState(hasBooksId);
    const [BookIndeterminate, setBookIndeterminate] = useState(true);
    const [checkAllBook, setCheckAllBook] = useState(false);
    const onChangeBook = (list) => {
        setCheckedBookList(list);
        setBookIndeterminate(
            !!list.length && list.length < BookOptions.length
        );
        setCheckAllBook(list.length === BookOptions.length);
    };
    const onCheckAllChangeBook = (e) => {
        setCheckedBookList(e.target.checked ? BookOptions : []);
        setBookIndeterminate(false);
        setBookIndeterminate(e.target.checked);
    };



    // Get All Permisiion Under Role
    const RoleOptions = Permz?.Roles?.map(
        (item) => {
            return { label: item.name, value: item.id };
        }
    );
    const [checkedRoleList, setCheckedRoleList] = useState(hasRole);
    const [RoleIndeterminate, setRoleIndeterminate] = useState(true);
    const [checkAllRole, setCheckAllRole] = useState(false);
    const onChangeRole = (list) => {
        setCheckedRoleList(list);
        setRoleIndeterminate(!!list.length && list.length < RoleOptions.length);
        setCheckAllRole(list.length === RoleOptions.length);
    };
    const onCheckAllChangeRole = (e) => {
        setCheckedRoleList(e.target.checked ? RoleOptions : []);
        setRoleIndeterminate(false);
        setRoleIndeterminate(e.target.checked);
    };



 

  // Get All Permisiion Under Request
  const RequestOptions = Permz?.BookRequest?.map(
    (item) => {
        return { label: item.name, value: item.id };
    }
);
const [checkedRequestList, setCheckedRequestList] = useState(hasRequestId);
const [RequestIndeterminate, setRequestIndeterminate] = useState(true);
const [checkAllRequest, setCheckAllRequest] = useState(false);
const onChangeRequest = (list) => {
    setCheckedRequestList(list);
    setRequestIndeterminate(
        !!list.length && list.length < RequestOptions.length
    );
    setCheckAllRequest(list.length === RequestOptions.length);
};
const onCheckAllChangeRequest = (e) => {
    setCheckedRequestList(e.target.checked ? RequestOptions : []);
    setRequestIndeterminate(false);
    setRequestIndeterminate(e.target.checked);
};




  // Get All Permisiion Under Circulations
  const CirculationsOptions = Permz?.Circulations?.map(
    (item) => {
        return { label: item.name, value: item.id };
    }
);
const [checkedCirculationsList, setCheckedCirculationsList] = useState(hasCirculationsId);
const [CirculationsIndeterminate, setCirculationsIndeterminate] = useState(true);
const [checkAllCirculations, setCheckAllCirculations] = useState(false);
const onChangeCirculations = (list) => {
    setCheckedCirculationsList(list);
    setCirculationsIndeterminate(
        !!list.length && list.length < CirculationsOptions.length
    );
    setCheckAllCirculations(list.length === CirculationsOptions.length);
};
const onCheckAllChangeCirculations = (e) => {
    setCheckedCirculationsList(e.target.checked ? CirculationsOptions : []);
    setCirculationsIndeterminate(false);
    setCirculationsIndeterminate(e.target.checked);
};

  // Get All Permisiion Under Settings
  const SettingsOptions = Permz?.Settings?.map(
    (item) => {
        return { label: item.name, value: item.id };
    }
);
const [checkedSettingsList, setCheckedSettingsList] = useState(hasSettings);
const [SettingsIndeterminate, setSettingsIndeterminate] = useState(true);
const [checkAllSettings, setCheckAllSettings] = useState(false);
const onChangeSettings = (list) => {
    setCheckedSettingsList(list);
    setSettingsIndeterminate(
        !!list.length && list.length < SettingsOptions.length
    );
    setCheckAllSettings(list.length === SettingsOptions.length);
};
const onCheckAllChangeSettings = (e) => {
    setCheckedSettingsList(e.target.checked ? SettingsOptions : []);
    setSettingsIndeterminate(false);
    setSettingsIndeterminate(e.target.checked);
};



    const onFinish = (value) => {
        try {
            const data = {
                // id : record?.id,
                permission: [
                    ...value.users,
                    ...value.members,
                    ...value.attributes,
                    ...value.books,
                    ...value.requests,
                    ...value.role,
                    ...value.circulations,
                    ...value.settings,

                ],
            };
            setIsloadingSubmit(true);
            // console.log(data);
            // return false;
            updateRequest(URL_UPDATE_PERMISSIONS,record?.id, {...data} , jwt)
                .then((res) => {
                    // console.log(res?.data);
                    setIsloadingSubmit(false);
                    handleRequestResponse(res);
                    RoleWithPermissionsDataObject.refetchEntity();
                    // setIsModalVisible(false);
                })
                .catch((err) => {
                    handleRequestError(err);
                    setIsloadingSubmit(false);
                    // console.log(err?.response?.data?.error);
                });

        } catch (error) {

        }
    }


    //   console.log(indeterminate)

    return (
        <div className="users_form">
            <Form onFinish={onFinish} form={form} name="basic" size="middle">
                <div className="row">
                <div className="col-12">
            <div className="form-group custom-select">
              <label forHtml="">Role Name</label>
              <Form.Item
                name="name"
              >
              <Input 
                className="form-control"
                disabled
                defaultValue={record?.name}
              />
                   {/* <Select 
                   defaultValue={record?.name}
              style={{ width: 200 }} 
              disabled
              className="form-control"
            >
            
              
          <Option  value={record?.id} >{record?.name}</Option>
                
           
            </Select> */}
              </Form.Item>
            </div>
            </div>

                    <div className="col-md-12">
                        <Form.Item name="check">
                            <div className="col-12">
                                <div style={{ display: "none" }}>
                                    <Checkbox
                                        indeterminate={UserIndeterminate}
                                        onChange={onCheckAllChangeUser}
                                        checked={checkAllUser}
                                    >
                                        Check all
                                    </Checkbox>
                                </div>
                                <div className="col-12">
                                    <p style={{ fontWeight: '700' }}>Users</p>
                                </div>
                                <Form.Item name="users">
                                    <CheckboxGroup
                                        options={UserOptions}
                                        value={checkedUserList}
                                        onChange={onChangeUser}
                                    />
                                </Form.Item>
                            </div>

                            <div className="col-12">
                                <div style={{ display: "none" }}>
                                    <Checkbox
                                        indeterminate={MemberIndeterminate}
                                        onChange={onCheckAllChangeMember}
                                        checked={checkAllMember}
                                    >
                                        Check all
                                    </Checkbox>
                                </div>
                                <div className="col-12">
                                    <p style={{ fontWeight: '700' }}>Members</p>
                                </div>
                                <Form.Item name="members">
                                    <CheckboxGroup
                                        options={MemberOptions}
                                        value={checkedMemberList}
                                        onChange={onChangeMember}
                                    />
                                </Form.Item>
                            </div>

                            <div className="col-12">
                                <div style={{ display: "none" }}>
                                    <Checkbox
                                        indeterminate={AttributesIndeterminate}
                                        onChange={onCheckAllChangeAttributes}
                                        checked={checkAllAttributes}
                                    >
                                        Check all
                                    </Checkbox>
                                </div>
                                <div className="col-12">
                                    <p style={{ fontWeight: '700' }}>attributes</p>
                                </div>
                                <Form.Item name="attributes">
                                    <CheckboxGroup
                                        options={Attributes}
                                        value={checkedAttributesList}
                                        onChange={onChangeProduct}
                                    />
                                </Form.Item>
                            </div>

                            <div className="col-12">
                                <div style={{ display: "none" }}>
                                    <Checkbox
                                        indeterminate={BookIndeterminate}
                                        onChange={onCheckAllChangeBook}
                                        checked={checkAllBook}
                                    >
                                        Check all
                                    </Checkbox>
                                </div>
                                <div className="col-12">
                                    <p style={{ fontWeight: '700' }}>Books</p>
                                </div>
                                <Form.Item name="books">
                                    <CheckboxGroup
                                        options={BookOptions}
                                        value={checkedBookList}
                                        onChange={onChangeBook}
                                    />
                                </Form.Item>
                            </div>

    
                           

                            <div className="col-12">
                                <div style={{ display: "none" }}>
                                    <Checkbox
                                        indeterminate={RoleIndeterminate}
                                        onChange={onCheckAllChangeRole}
                                        checked={checkAllRole}
                                    >
                                        Check all
                                    </Checkbox>
                                </div>
                                <div className="col-12">
                                    <p style={{ fontWeight: '700' }}>Roles</p>
                                </div>
                                <Form.Item name="role">
                                    <CheckboxGroup
                                        options={RoleOptions}
                                        value={checkedRoleList}
                                        onChange={onChangeRole}
                                    />
                                </Form.Item>
                            </div>






<div className="col-12">
<div style={{ display: "none" }}>
    <Checkbox
        indeterminate={RequestIndeterminate}
        onChange={onCheckAllChangeRequest}
        checked={checkAllRequest}
    >
        Check all
    </Checkbox>
</div>
<div className="col-12">
    <p style={{ fontWeight: '700' }}>Book Requests</p>
</div>
<Form.Item name="requests">
    <CheckboxGroup
        options={RequestOptions}
        value={checkedRequestList}
        onChange={onChangeRequest}
    />
</Form.Item>
</div>



<div className="col-12">
<div style={{ display: "none" }}>
    <Checkbox
        indeterminate={CirculationsIndeterminate}
        onChange={onCheckAllChangeCirculations}
        checked={checkAllCirculations}
    >
        Check all
    </Checkbox>
</div>
<div className="col-12">
    <p style={{ fontWeight: '700' }}>Book Circulations</p>
</div>
<Form.Item name="circulations">
    <CheckboxGroup
        options={CirculationsOptions}
        value={checkedCirculationsList}
        onChange={onChangeCirculations}
    />
</Form.Item>
</div>

<div className="col-12">
<div style={{ display: "none" }}>
    <Checkbox
        indeterminate={SettingsIndeterminate}
        onChange={onCheckAllChangeSettings}
        checked={checkAllSettings}
    >
        Check all
    </Checkbox>
</div>
<div className="col-12">
    <p style={{ fontWeight: '700' }}>Settings</p>
</div>
<Form.Item name="settings">
    <CheckboxGroup
        options={SettingsOptions}
        value={checkedSettingsList}
        onChange={onChangeSettings}
    />
</Form.Item>
</div>

                          

                        </Form.Item>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-8"></div>
                    <div className="col-4">
                        <div className="d-flex justify-content-end save_btn mt-4">
                            <Form.Item>
                                <Button
                                    loading={isloadingSubmit}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    Save
                                </Button>
                            </Form.Item>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}
export default EditPermission;