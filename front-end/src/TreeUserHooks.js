import React, { useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Tree } from "antd";

const { TreeNode } = Tree;

const TreeUser = () => {

  const [data, setData] = useState({
    treeData: [
      { title: 'Expand to load', key: '0' },
      { title: 'Expand to load', key: '1' },
      { title: 'Tree Node', key: '2', isLeaf: true },
    ],
  })

  const onLoadData = ({treeNode, children, dataRef, eventKey}) =>
    new Promise(resolve => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        children = [
          { title: 'Child Node', key: `${eventKey}-0` },
          { title: 'Child Node', key: `${eventKey}-1` },
        ];
        setData({
          treeData: [data],
        });
        resolve();
      }, 1000);
    });

  const renderTreeNodes = data =>
    data.map(item => {
        console.log(data)
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });

    return <Tree loadData={onLoadData}>{renderTreeNodes(data.treeData)}</Tree>;
  
}

export default TreeUser; 

