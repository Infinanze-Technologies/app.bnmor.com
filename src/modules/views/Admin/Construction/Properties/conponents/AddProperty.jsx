import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  Form,
  Input,
  DatePicker,
  Card,
  Row,
  Col,
  Tooltip,
  message,
  Spin,
  Switch,
  Tag
} from "antd";
import ImageUpload from '@/components/form/ImageUpload';
import RichTextEditor from '@/components/form/RichTextEditor';
import { postRequest } from "@/hooks/apiService";
import { URL_ADD_PROPERTIES, URL_GET_PROPERTY_CATEGORIES, URL_GET_CATEGORY_ATTRIBUTES } from "@/config/api-paths";
import useHandleResponse from "@/hooks/useHandleResponse";
import useSelectQuery from "@/hooks/ReactQuery/useSelectQuery";
import amenitiesData from "@/constants/amenities.json";


const { Option } = Select;

const getBase64 = file =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const AddProperty = (props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const { handleRequestError, handleRequestResponse } = useHandleResponse()
  let { setIsModalVisible, refetch, jwt, forceRefetch } = props;

  // Handle image upload changes
  const handleImageChange = (newFileList) => {
    setFileList(newFileList);
  };

  // Handle amenities change
  const handleAmenitiesChange = (value) => {
    setAmenities(value);
  };

  // Fetch categories
  const CategoriesDataObject = useSelectQuery({
    url: URL_GET_PROPERTY_CATEGORIES,
    jwt: jwt,
    tableKey: "Categories",
    filter: ''
  });

  // Fetch subcategories and statuses when category changes
  const CategoryAttributesDataObject = useSelectQuery({
    url: selectedCategory ? `${URL_GET_CATEGORY_ATTRIBUTES}/${selectedCategory}` : null,
    jwt: jwt,
    tableKey: "CategoryAttributes",
    filter: ''
  });

  // Update subcategories and statuses when category attributes are loaded
  useEffect(() => {
    if (CategoryAttributesDataObject?.data) {
      const attributes = CategoryAttributesDataObject.data;
      setSubcategories(attributes.subcategories || []);
      setStatuses(attributes.statuses || []);
    } else {
      setSubcategories([]);
      setStatuses([]);
    }
  }, [CategoryAttributesDataObject]);

  // Reset subcategory and status when category changes
  useEffect(() => {
    if (!selectedCategory) {
      form.setFieldsValue({
        subcategory_id: undefined,
        status_id: undefined
      });
    }
  }, [selectedCategory, form]);

  const categoryOptions = CategoriesDataObject?.data || [];

  // Category field mapping for dynamic field visibility
  const categoryFieldMap = {
    Buildings: {
      show: ['title', 'description', 'location', 'price', 'status_id', 'subcategory_id', 'bedrooms', 'bathrooms', 'size', 'amenities', 'furnished', 'images', 'business_id'],
      hide: ['land_size', 'duration', 'project_timeline', 'contractor']
    },
    Plots: {
      show: ['title', 'description', 'location', 'price', 'land_size', 'subcategory_id', 'status_id', 'amenities', 'business_id','images'],
      hide: ['bedrooms', 'bathrooms', 'furnished', 'project_timeline', 'contractor']
    },
    Projects: {
      show: ['title', 'description', 'location', 'subcategory_id', 'status_id', 'budget', 'start_date', 'end_date', 'contractor', 'amenities', 'business_id', 'images'],
      hide: ['price', 'bedrooms', 'bathrooms', 'furnished', 'land_size']
    }
  };

  // Get current category name for field mapping
  const currentCategoryName = categoryOptions.find(cat => cat.id === selectedCategory)?.name;
  const currentFieldMap = categoryFieldMap[currentCategoryName] || { show: [], hide: [] };

  // Get amenities based on selected category with fallback
  const getAmenitiesForCategory = (categoryName) => {
    if (!categoryName) return [];
    
    // Try exact match first
    if (amenitiesData[categoryName]) {
      return amenitiesData[categoryName];
    }
    
    // Try case-insensitive match
    const lowerCategoryName = categoryName.toLowerCase();
    for (const key in amenitiesData) {
      if (key.toLowerCase() === lowerCategoryName) {
        return amenitiesData[key];
      }
    }
    
    // Try partial matches for common variations
    if (lowerCategoryName.includes('plot')) {
      return amenitiesData['Plots'] || [];
    }
    if (lowerCategoryName.includes('project')) {
      return amenitiesData['Projects'] || [];
    }
    if (lowerCategoryName.includes('building')) {
      return amenitiesData['Buildings'] || [];
    }
    
    return [];
  };
  
  const availableAmenities = getAmenitiesForCategory(currentCategoryName);

  // Helper function to check if field should be shown
  const shouldShowField = (fieldName) => {
    if (!selectedCategory) return true; // Show all fields when no category selected
    return currentFieldMap.show.includes(fieldName);
  };


  // Form submit handler
  const onFinish = async values => {
    
    // Convert uploaded image to base64
    let imageBase64 = null;
    
    // Process uploaded file
    if (fileList.length > 0 && fileList[0].originFileObj) {
      imageBase64 = await getBase64(fileList[0].originFileObj);
    }
    
    // Prepare data for API submission - only include fields that should be shown
    const data = {
      category_id: values.category_id,
      subcategory_id: values.subcategory_id,
      title: values.title,
      description: values.description,
      location: values.location,
      status_id: values.status_id,
      image: imageBase64 || "string",
      amenities: amenities || [],
      business_id: values.business_id
    };

    // Add conditional fields based on what should be shown
    if (shouldShowField('price')) {
      data.price = parseFloat(values.price);
    }
    
    if (shouldShowField('land_size')) {
      data.land_size = parseFloat(values.land_size) || 0;
    }
    
    if (shouldShowField('bedrooms')) {
      data.bedrooms = parseInt(values.bedrooms) || 0;
    }
    
    if (shouldShowField('bathrooms')) {
      data.bathrooms = parseInt(values.bathrooms) || 0;
    }
    
    if (shouldShowField('size')) {
      data.size = parseFloat(values.size) || 0;
    }
    
    if (shouldShowField('furnished')) {
      data.furnished = values.furnished || false;
    }
    
    if (shouldShowField('budget')) {
      data.budget = parseFloat(values.budget) || 0;
    }
    
    if (shouldShowField('start_date')) {
      data.start_date = values.start_date?.format("YYYY-MM-DD") || null;
    }
    
    if (shouldShowField('end_date')) {
      data.end_date = values.end_date?.format("YYYY-MM-DD") || null;
    }
    
    if (shouldShowField('contractor')) {
      data.contractor = values.contractor || "";
    }

    setLoading(true);
    postRequest(URL_ADD_PROPERTIES, {...data}, jwt)
    .then(async (res) => {
      setLoading(false);
      handleRequestResponse(res)
      form.resetFields();
      setFileList([]);
      setSelectedCategory(null);
      setSubcategories([]);
      setStatuses([]);
      setAmenities([]);
      await forceRefetch();
      setIsModalVisible(false);
    })
    .catch((err) => {
      handleRequestError(err)
    })
    .finally(() => {
      setLoading(false);
    })
  };

  // Replace all Select, Input, and DatePicker components' style props to use a consistent style
  const FIELD_STYLE = { width: '100%', height: 50, borderRadius: 10 };
  const SELECT_PROPS = {
    showSearch: true,
    filterOption: (input, option) =>
      (option?.children ?? '').toLowerCase().includes(input.toLowerCase()),
    dropdownMatchSelectWidth: true,
    className: 'custom-select-field',
    style: FIELD_STYLE,
  };

  return (
    <div style={{ 
      maxWidth: 900, 
      margin: "0 auto", 
      padding: 24,
      maxHeight: '80vh',
      overflowY: 'auto',
      overflowX: 'hidden'
    }}>
      <Card
        title={<span style={{ fontSize: 24, fontWeight: 700, color: "#2a3f54" }}>Create New Property</span>}
        bordered={false}
        style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", borderRadius: 12 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          {/* Property Basic Information */}
          <Card type="inner" title="Property Information" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
              <Form.Item
                  label="Category"
                  name="category_id"
                  rules={[{ required: true, message: "Category is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select category" 
                    className="custom-select"
                    onChange={(value) => setSelectedCategory(value)}
                  >
                    {categoryOptions.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
              </Form.Item>
              </Col>
              <Col xs={24} md={12}>
              <Form.Item
                  label="Property Title"
                  name="title"
                  rules={[{ required: true, message: "Property title is required" }]}
                >
                  <Input placeholder="Enter property title" style={FIELD_STYLE} disabled={!selectedCategory} />
              </Form.Item>
              </Col>
              <Col xs={24} md={12}>
              <Form.Item
                  label="Location"
                  name="location"
                  rules={[{ required: true, message: "Location is required" }]}
                >
                  <Input placeholder="Enter property location" style={FIELD_STYLE} disabled={!selectedCategory} />
              </Form.Item>
              </Col>
              {shouldShowField('price') && (
              <Col xs={24} md={12}>
              <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: "Price is required" }]}
                  >
                    <Input 
                      placeholder="Enter property price" 
                    style={FIELD_STYLE}
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={!selectedCategory}
                  />
                </Form.Item>
              </Col>
              )}
              <Col xs={24} md={12}>
                <Form.Item
                  label="Subcategory"
                  name="subcategory_id"
                  rules={[{ required: true, message: "Subcategory is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select subcategory" 
                    className="custom-select"
                    disabled={!selectedCategory}
                  >
                    {subcategories.map((subcategory) => (
                      <Option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Status"
                  name="status_id"
                  rules={[{ required: true, message: "Status is required" }]}
                >
                  <Select 
                    {...SELECT_PROPS} 
                    placeholder="Select status" 
                    className="custom-select"
                    disabled={!selectedCategory}
                  >
                    {statuses.map((status) => (
                      <Option key={status.id} value={status.id}>
                        {status.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Property Details */}
          <Card type="inner" title="Property Details" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              {shouldShowField('land_size') && (
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Land Size (sq ft)"
                    name="land_size"
                    rules={[{ required: true, message: "Land size is required" }]}
                  >
                    <Input 
                      placeholder="Enter land size" 
                      style={FIELD_STYLE}
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={!selectedCategory}
                    />
                  </Form.Item>
                </Col>
              )}
              {shouldShowField('bedrooms') && (
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Bedrooms"
                    name="bedrooms"
                    rules={[{ required: true, message: "Number of bedrooms is required" }]}
                  >
                    <Input 
                      placeholder="Enter number of bedrooms" 
                      style={FIELD_STYLE}
                      type="number"
                      min="0"
                      disabled={!selectedCategory}
                    />
                  </Form.Item>
                </Col>
              )}
              {shouldShowField('bathrooms') && (
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Bathrooms"
                    name="bathrooms"
                    rules={[{ required: true, message: "Number of bathrooms is required" }]}
                  >
                    <Input 
                      placeholder="Enter number of bathrooms" 
                      style={FIELD_STYLE}
                      type="number"
                      min="0"
                      disabled={!selectedCategory}
                    />
                  </Form.Item>
                </Col>
              )}
              {shouldShowField('size') && (
                <Col xs={24} md={8}>
                <Form.Item
                    label="Size (sq ft)"
                    name="size"
                    rules={[{ required: true, message: "Property size is required" }]}
                  >
                    <Input 
                      placeholder="Enter property size" 
                      style={FIELD_STYLE}
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={!selectedCategory}
                    />
                </Form.Item>
              </Col>
              )}
              {shouldShowField('budget') && (
                <Col xs={24} md={12}>
                <Form.Item
                    label="Budget"
                    name="budget"
                    rules={[{ required: true, message: "Budget is required" }]}
                >
                  <Input 
                      placeholder="Enter budget" 
                    style={FIELD_STYLE}
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={!selectedCategory}
                  />
                </Form.Item>
              </Col>
              )}
              {shouldShowField('furnished') && (
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Furnished"
                    name="furnished"
                    valuePropName="checked"
                  >
                    <Switch 
                      checkedChildren="Yes" 
                      unCheckedChildren="No"
                      style={{ height: 50 }}
                      disabled={!selectedCategory}
                    />
                  </Form.Item>
                </Col>
              )}
              {shouldShowField('amenities') && (
              <Col xs={24} md={12}>
      <Form.Item
                    label="Amenities"
                    name="amenities"
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select amenities"
                      style={FIELD_STYLE}
                      value={amenities}
                      onChange={handleAmenitiesChange}
                      disabled={!selectedCategory}
                      tagRender={(props) => {
                        const { label, closable, onClose } = props;
                        return (
                          <Tag
                            color="blue"
                            closable={closable}
                            onClose={onClose}
                            style={{ marginRight: 3 }}
                          >
                            {label}
                          </Tag>
                        );
                      }}
                    >
                      {availableAmenities.map((amenity) => (
                        <Option key={amenity} value={amenity}>
                          {amenity}
                        </Option>
                      ))}
        </Select>
      </Form.Item>
              </Col>
              )}
              {shouldShowField('contractor') && (
              <Col xs={24} md={12}>
      <Form.Item
                    label="Contractor"
                    name="contractor"
                >
                    <Input 
                      placeholder="Enter contractor name" 
                      style={FIELD_STYLE}
                      disabled={!selectedCategory}
                    />
      </Form.Item>
              </Col>
              )}
            </Row>
          </Card>

          {/* Project Timeline */}
          {(shouldShowField('start_date') || shouldShowField('end_date')) && (
            <Card type="inner" title="Project Timeline" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
                {shouldShowField('start_date') && (
              <Col xs={24} md={12}>
<Form.Item
                      label="Start Date"
                      name="start_date"
                      rules={[{ required: true, message: "Start date is required" }]}
                    >
                      <DatePicker
                        style={FIELD_STYLE}
                        format="YYYY-MM-DD"
                        placeholder="Select start date"
                        disabled={!selectedCategory}
                      />
</Form.Item>
              </Col>
                )}
                {shouldShowField('end_date') && (
              <Col xs={24} md={12}>
              <Form.Item
                      label="End Date"
                      name="end_date"
                      rules={[{ required: true, message: "End date is required" }]}
                    >
                      <DatePicker
                        style={FIELD_STYLE}
                        format="YYYY-MM-DD"
                        placeholder="Select end date"
                        disabled={!selectedCategory}
                      />
              </Form.Item>
              </Col>
                )}
            </Row>
          </Card>
          )}

          {/* Description */}
          <Card type="inner" title="Property Description" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24}>
              <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: "Description is required" }]}
                >
                  <RichTextEditor 
                    placeholder="Enter property description"
                    height={300}
                    disabled={!selectedCategory}
                  />
              </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Image Upload */}
          {shouldShowField('images') && (
            <Card type="inner" title="Property Image" style={{ marginBottom: 24, borderRadius: 8 }}>
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  label={
                      <Tooltip title="Upload property image" color="#ffffff">
                        Upload Property Image
                    </Tooltip>
                  }
                  rules={[
                      { required: true, message: "Please upload a property image" }
                  ]}
                >
                  <ImageUpload
                    fileList={fileList}
                    onChange={handleImageChange}
                      maxCount={1}
                    uploadText="Upload"
                    disabled={!selectedCategory}
                    maxSizeMB={5}
                  />
                </Form.Item>
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                    <strong>Note:</strong> Upload a single property image (Maximum file size: 5MB)
                </div>
              </Col>
            </Row>
          </Card>
          )}

          <Form.Item style={{ textAlign: "right" }}>
                      <Button
                        type="primary"
                        htmlType="submit"
              shape="round"
              loading={loading}
              size="large"
              style={{ minWidth: 120 }}
              disabled={!selectedCategory}
                      >
                        Save
                      </Button>
                    </Form.Item>
</Form>
      </Card>
            </div>
  );
};

export default AddProperty;
