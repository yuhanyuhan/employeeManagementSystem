import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Tree } from "antd";

const { TreeNode } = Tree;

class TreeUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [
        { title: "Expand to load", key: "0" },
        //   { title: "Expand to load", key: "1" },
        //   { title: "Tree Node", key: "2", isLeaf: true }
      ], 
      parentTree: [], 
      childTree:[] 
    };
  }

  componentDidMount() {
    fetch("http://localhost:4000/get")
      .then(response => response.json())
    //   .then(data => console.log(data))
      .then(data => {
        this.setState({ treeData: data.filter(el=>el.job_title==="ceo") });
      });
  }

  onLoadData = treeNode =>
    new Promise(resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: "Child Node", user_id: `${treeNode.props.eventKey}-0` },
          { title: "Child Node", user_id: `${treeNode.props.eventKey}-1` }
        ];
        this.setState({
          treeData: [...this.state.treeData]
        });
        resolve();
      }, 1000);
    });

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.emp_name} key={item.user_id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.user_id} {...item} dataRef={item} />;
    });

  render() {
    return (
      <Tree loadData={this.onLoadData}>
        {this.renderTreeNodes(this.state.treeData)}
      </Tree>
    );
  }
}

export default TreeUser;
