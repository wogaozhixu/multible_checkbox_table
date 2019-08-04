import React, { Component } from 'react';
import { Checkbox, Table, Card } from 'antd';

const { Group: CheckboxGroup } = Checkbox;

class MultibleCheckboxTable extends Component {
  state = {
    checkedLists: {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
    },
    data: [
      {
        key: '0',
        optObj: '操作对象',
        authority: ['权限'],
        indeterminate: false,
        checkAll: false,
      },
      {
        key: '1',
        optObj: '工作区1',
        authority: ['用户管理', '组织管理', '角色管理'],
        indeterminate: false,
        checkAll: false,
      },
      {
        key: '2',
        optObj: '工作区2',
        authority: ['新建', '编辑', '删除', '公开私有设置'],
        indeterminate: false,
        checkAll: false,
      },
      {
        key: '3',
        optObj: '工作区3',
        authority: ['新建', '编辑', '删除'],
        indeterminate: false,
        checkAll: false,
      },
      {
        key: '4',
        optObj: '工作区4',
        authority: ['新建', '编辑', '删除'],
        indeterminate: false,
        checkAll: false,
      },
      {
        key: '5',
        optObj: '工作区5',
        authority: ['新建', '编辑', '删除', '分享', '导出'],
        indeterminate: false,
        checkAll: false,
      },
      {
        key: '6',
        optObj: '工作区6',
        authority: ['新建', '编辑', '删除', '分享', '导出'],
        indeterminate: false,
        checkAll: false,
      },
      {
        key: '7',
        optObj: '工作区7',
        authority: ['新建', '编辑', '删除', '分享', '导出'],
        indeterminate: false,
        checkAll: false,
      },
    ],
  };

  // 单个checkbox变化，修改单个选中状态和当前行全选中状态
  onChange = (e, current) => {
    const { checkedLists, data } = this.state;
    // 当前选中数组赋值
    const currentArr = checkedLists[current.key];
    // 当前已选中数组去重赋值
    const element = e.filter((ele, i, s) => s.indexOf(ele) === i);

    // 设置选中checkbox
    currentArr.splice(0);
    current.authority.map(item => {
      if (element.includes(item)) {
        currentArr.push(item);
      }
      return currentArr;
    });

    // 判断当前行选中状态
    if (currentArr.length < data[current.key].authority.length && currentArr.length > 0) {
      data[current.key].indeterminate = true;
      data[current.key].checkAll = false;
    } else if (currentArr.length === data[current.key].authority.length) {
      data[current.key].indeterminate = false;
      data[current.key].checkAll = true;
    } else {
      data[current.key].indeterminate = false;
      data[current.key].checkAll = false;
    }

    // 判断全局全选状态
    if (data.slice(1, data.length).every(d => d.checkAll === true)) {
      data[0].indeterminate = false;
      data[0].checkAll = true;
    } else if (data.some(d => d.checkAll === true)) {
      data[0].indeterminate = true;
      data[0].checkAll = false;
    } else {
      data[0].indeterminate = false;
      data[0].checkAll = false;
    }

    // 更新data和checkedLists
    this.setState({
      data,
      checkedLists,
    });
  };

  // action 操作栏，操作选中状态
  onCheckAllChange = current => {
    const { checkedLists, data } = this.state;
    const currentArr = checkedLists[current.key];
    if (current.key === '0') {
      // 全局全选操作其他选中状态
      data[0].checkAll = !data[0].checkAll;
      data.map(item => {
        data[item.key].indeterminate = false;
        data[item.key].checkAll = data[0].checkAll;
        if (item.key !== '0') {
          if (!data[0].checkAll) {
            checkedLists[item.key].splice(0);
          } else {
            checkedLists[item.key].push(...item.authority);
          }
        }
        return checkedLists;
      });
    } else {
      // 判断当前行全选状态
      if (!data[current.key].checkAll) {
        currentArr.push(...current.authority);
        data[current.key].checkAll = true;
      } else {
        currentArr.splice(0);
        data[current.key].checkAll = false;
      }
      // 判断全局全选状态
      if (data.slice(1, data.length).every(d => d.checkAll === true)) {
        data[0].indeterminate = false;
        data[0].checkAll = true;
      } else if (data.some(d => d.checkAll === true)) {
        data[0].indeterminate = true;
        data[0].checkAll = false;
      } else {
        data[0].indeterminate = false;
        data[0].checkAll = false;
      }
      data[current.key].indeterminate = false;
    }

    // 更新data和checkedLists
    this.setState({
      data,
      checkedLists,
    });
  };

  render() {
    const { data, checkedLists } = this.state;
    // table列表
    const columns = [
      {
        title: 'optObj',
        dataIndex: 'optObj',
        key: 'optObj',
      },
      {
        title: 'authority',
        dataIndex: 'authority',
        key: 'authority',
        render: (text, record) => {
          const arr = [];
          record.authority.map(item => arr.push(item));
          return record.key !== '0' ? (
            <CheckboxGroup
              options={arr}
              value={checkedLists[record.key]}
              onChange={e => this.onChange(e, record)}
            />
          ) : (
            '权限'
          );
        },
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => {
          return record.key !== '0' ? (
            <Checkbox
              indeterminate={record.indeterminate}
              onChange={() => this.onCheckAllChange(record)}
              checked={record.checkAll}
            />
          ) : (
            <Checkbox
              indeterminate={record.indeterminate}
              onChange={() => this.onCheckAllChange(record)}
              checked={record.checkAll}
            >
              全选
            </Checkbox>
          );
        },
      },
    ];

    return (
      <Card title="多维度选项表格（适用于用户权限管理）">
        <Table columns={columns} dataSource={data} pagination={false} showHeader={false} bordered />
      </Card>
    );
  }
}

export default MultibleCheckboxTable;
