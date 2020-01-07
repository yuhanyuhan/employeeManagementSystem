import React, { useState } from "react";

import "antd/dist/antd.css";
import { Input, Form, Button, Select, Row } from "antd";

const { Option } = Select;

const AddUser = ({ form }) => {
  const [details, setDetails] = useState({});
  const [isRequired, setRequired] = useState(true)
  const [rank, setRank] = useState("null")

  const {
    getFieldDecorator,
    validateFields,
    setFieldsValue,
    resetFields
  } = form;

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        setDetails(values);
      }
    });
  };

  const handleCEO = value => {
    console.log(value)
    setRank(value);
    (value === "ceo" ? setRequired(false) : setRequired(true))
    setFieldsValue({
      reportTo: null
    })
  }

  const handleSelectChange = value => {
    console.log(value);
    setFieldsValue({
      jobTitle: `you are reporting to, ${
        value === "ceo" ? null : value 
      }!`
    });
  };

  return (
    <Form
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 12 }}
      onSubmit={handleSubmit}
      className="login-form"
    >
      <Form.Item label="Name">
        {getFieldDecorator("name", {
          rules: [
            { required: true, message: "Please input new employee's name!" }
          ]
        })(<Input placeholder="Please input new employee's name" />)}
      </Form.Item>

      <Form.Item label="Job Title">
        {getFieldDecorator("jobTitle", {
          rules: [{ required: true, message: "Please select their role!" }]
        })(
          <Select
            placeholder="Select a option and change input text above"
            onChange={handleCEO}
          >
            <Option value="staff">Staff</Option>
            <Option value="manager">Manager</Option>
            <Option value="ceo">CEO</Option>
          </Select>
        )}
      </Form.Item>

      <Form.Item label="Reporting to"> 
        {getFieldDecorator("reportTo", {
          rules: [
            {
              required: isRequired,
              message: "Please select person reporting to!",
            }
          ]
        })( 
          <Select placeholder="Please select person-to-report" disabled={rank === "ceo" ? true : false}>
            <Option value="red">Red</Option>
            <Option value="green">Green</Option>
            <Option value="blue">Blue</Option>
          </Select>
        )}
      </Form.Item>

      <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
        <Row type="flex" justify="center">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>

          <Button type="danger" onClick={()=>{resetFields()}}>
            Clear
          </Button>

        </Row>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(AddUser);
