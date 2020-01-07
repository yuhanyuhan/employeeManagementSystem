import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import AddUser from "./AddUser";

import { Layout, Menu } from "antd";
const { Sider, Content } = Layout;

function App() {
  return (
    <div className="App">
      <Layout style={{ background: "#fff" }}>
        <Router>
          <>
            <Sider
              style={{
                overflow: "auto",
                height: "100vh",
                left: 0
              }}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{ height: "100%" }}
              >
                <Menu.Item key="1">
                  <Link to="/">Add New User</Link>
                </Menu.Item>

                <Menu.Item key="2">
                  <Link to="/view_users">Edit Users</Link>
                </Menu.Item>

                <Menu.Item key="3">
                  <Link to="/view_all">View Current Employee</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Content style={{ padding: "24px 0", minHeight: 280 }}>
                <Switch>
                  <Route exact path="/">
                    <AddUser />
                  </Route>
                </Switch>
              </Content>
            </Layout> 
          </>
        </Router>
      </Layout>
    </div>
  );
}

export default App;
