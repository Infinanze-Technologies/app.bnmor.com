import { useEffect } from "react";
import {Select, Form, Input,Space, Empty } from "antd";
import _ from 'lodash'
const { Option } = Select;
const ViewAttributes = (props) => {
  const { record } = props;
  const [form] = Form.useForm();
  console.log(record?.pro_attr_items)
 
  useEffect(() => {
    try {
      if (!_.isEmpty(record?.pro_attr_items)) {
        let pro_attr = record?.pro_attr_items
   let attr = []

        pro_attr?.map((obj) => {
          let cost = {
           
            model_type_name: obj?.model_type_name,
            attr_has_item_name: obj?.attr_has_item_name,
          
          };
        //    console.log(obj);
           attr.push(cost);
          return obj;
        }, [record?.pro_attr_items]);


        form.setFieldsValue({
            attrData: [...attr],
            // final_total : Number(purchase_total) - Number(discountAmount) + Number(shippingtAmount)
        });
      } else {
        form.setFieldsValue({
          attrData: [],
        });
      }
    } catch (error) {
      console.log('AN ERROR ORCCURED HERE',error);
    }
  }, [record?.pro_attr_items]);

  return (
    <>
    {
      record?.pro_attr_items?.length == 0 ?

      (
        <Empty/>
      )
      :
      (
<>

<Form  form={form} name="basic" size="middle">
        <div className="row">

  

        <Form.List name={'attrData'}>
              {(fields, { add, remove }) => (
                <>

                 {fields.map(({
                    key,
                    name,
                    record,
                    ...restField

                  }) => (
                    <Space

                      key={key}
                      style={{
                        display: 'd-flex',
                        marginBottom: 8,
                      }}
                      align="baseline"
                    >
                      <div style={{ display: 'none' }}>
                        <Form.Item
                          {...restField}
                          name={[name, "id"]}
                          key={[key, "id"]}
                        >
                          <Input className="form-control" type="text" width="100%" hidden={true} />
                        </Form.Item>
                      </div>
                      <div className="row">

                        <div className="col-sm-4 formlist">
                          <div className="form-group custom-select">

                            <Form.Item
                              {...restField}
                              name={[name, "model_type_name"]}
                              key={[key, "model_type_name"]}
                             
                            >
                              <Input className="form-control" type="text" width="100%" />
                            </Form.Item>
                         
                          </div>
                        </div>
                        


                        <div className="col-sm-4 formlist">
                          <div className="form-group custom-select">

                            <Form.Item
                              {...restField}
                              name={[name, "attr_has_item_name"]}
                              key={[key, "attr_has_item_name"]}
                             
                            >
                              <Input className="form-control" type="text" width="100%" />
                            </Form.Item>
                         
                          </div>
                        </div>


                      </div>





                    </Space>
                  ))}
                

                </>
              )}
            </Form.List>


         
         







        </div>
      </Form>
</>
      )
    }
    </>
  )
}

export default ViewAttributes