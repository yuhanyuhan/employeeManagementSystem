import React, { useState, useEffect } from "react";

import "antd/dist/antd.css";
import { Input, Form, Button, Select, Row, notification } from "antd";

const { Option } = Select;

const AddUser = ({ form }) => {
  const [isRequired, setRequired] = useState(true);
  const [rank, setRank] = useState("null");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let isCancelled = false;
    fetch("http://localhost:4000/get")
      .then(response => response.json())
      .then(response => {
        if (!isCancelled) setUsers(response);
      });
    return () => (isCancelled = true);
  }, [users]);

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
        fetch("http://localhost:4000/post", {
          method: "POST",
          body: new URLSearchParams({
            name: values.name,
            jobTitle: values.jobTitle,
            reportTo: values.reportTo
          })
        })
          .then(response => {
            const openNotificationWithIcon = type => {
              notification[type]({
                message: "New Class Added",
                description: "Please check if details are correct"
              });
            };
            openNotificationWithIcon("success");
          })
          .then(() => {
            resetFields();
          })
          .catch(error => {
            console.log(error);
          });
      }
    });
  };

  const handleCEO = value => {
    setRank(value);
    value === "ceo" ? setRequired(false) : setRequired(true);
    setFieldsValue({
      reportTo: null
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
              message: "Please select person reporting to!"
            }
          ]
        })(
          <Select
            placeholder="Please select person-to-report"
            disabled={rank === "ceo" ? true : false}
            showSearch
          >
            {users.map(el => (
              <Option key={el.user_id} value={el.user_id}>
                {el.emp_name}
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>

      <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
        <Row type="flex" justify="center">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>

          <Button
            type="danger"
            onClick={() => {
              resetFields();
            }}
          >
            Clear
          </Button>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default Form.create()(AddUser);
