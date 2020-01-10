import React from "react";
import { Button, Table, Input, InputNumber, Popconfirm, Form, Icon } from "antd";
import Highlighter from 'react-highlight-words';

const data = [];
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === "number") {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data, editingKey: "", index: {} };
    this.columns = [
      {
        title: "user",
        dataIndex: "emp_name",
        width: "25%",
        ...this.getColumnSearchProps('emp_name'),
        editable: true
      },
      {
        title: "role",
        dataIndex: "job_title",
        width: "25%",
        editable: true
      },
      {
        title: "reporting to",
        dataIndex: "isReportingTo",
        width: "25%",
        render: text => text.join(' > '), 
        editable: true
      },
      {
        title: "operation",
        dataIndex: "operation",
        key: "x",
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <Button
                    type="link"
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </Button>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => this.cancel(record.key)}
              >
                <Button type="link">Cancel</Button>
              </Popconfirm>
            </span>
          ) : (
            <>
              <Button
                type="link"
                disabled={editingKey !== ""}
                onClick={() => this.edit(record.user_id)}
                style={{ marginRight: 8 }}
              >
                Edit
              </Button>
              {this.state.index[record.user_id] ? (
                <Button type="link" disabled>
                  {" "}
                  Loading{" "}
                </Button>
              ) : (
                <Button type="link" onClick={() => this.delete(record.user_id)}>
                  Delete
                </Button>
              )}
            </>
          );
        }
      }
    ];
  }

   getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  componentDidMount() {
    fetch("http://localhost:4000/get")
      .then(response => response.json())
      .then(data => {
        this.setState({ data });
      });
  }

  isEditing = record => record.user_id === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: "" });
  };

  save(form, key, user_id) {
    form.validateFields((error, row) => {
      // console.log("row", row);
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        this.setState({ data: newData, editingKey: "" });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: "" });
      }

      const user_id = this.state.data[index].user_id;

      fetch(`http://localhost:4000/update/${user_id}`, {
        method: "PUT",
        body: new URLSearchParams({
          name: row.emp_name,
          jobTitle: row.job_title 
        })
      });
    });
  }

  edit(user_id) {
    this.setState({ editingKey: user_id });
  }

  delete = (user_id, key) => {
    let timeout = 1000 * Math.floor(Math.random() * 10 + 1);

    this.setState(prevState => {
      let index = { ...prevState.index };
      index[user_id] = true;
      return { index };
    });

    setTimeout(() => {
      fetch(`http://localhost:4000/delete/${user_id}`, {
        method: "DELETE"
      })
        .then(response => {
          console.log(response);
          console.log(this.state.index);
          console.log(timeout);
          fetch("http://localhost:4000/empList", {
            method: "GET"
          })
            .then(data => data.json())
            .then(data => {
              this.setState(prevState => {
                let index = { ...prevState.index };
                index[user_id] = false;
                return { index, data };
              });
            });
        })
        .catch(error => {
          console.log(error);
        });
    }, timeout);
  };

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: col.dataIndex === "age" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          rowKey={record => record.user_id} 
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={{
            onChange: this.cancel
          }}
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
