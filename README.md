# Multible Checkbox Table

Multi-dimensional option table based on secondary development of antdesign pro project.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Scope of application

The multidimensional options table is suitable for handling authority management related business.

### Implementation logic

```1.In the CheckAll Col, All checkboxes have two status: indeterminate or checkall;```
```2.Under the head checkAll Col, if they all checked in checkall, The CheckAll will be in checkall; otherwise it will be in indeterminate;```
```3.Under the authoriry Col, if one Row`s checkboxes all checked, then current Row`s last checkbox will be in the checkall status, otherwise it will be in the indeterminate status;```

### Key code

```bash
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
```

### Problem during change status

When I change the status of those checkbox, Use antdesign pro api, I can`t get current element, So I add another parameter to get it.
As show below:
```bash
render: (text, record) => {
  const arr = [];
  record.authority.map(item => arr.push(item));
  return record.key !== '0' ? (
    <CheckboxGroup
      options={arr}
      value={checkedLists[record.key]}
      onChange={e => this.onChange(e, record)} // during call onChange, I gave it two parameters.
    />
  ) : (
    '权限'
  );
},
```

### Summary

The most difficult problem in this project is dealing with logical relationships.

## The last

Welcome Welcome master to develop this feature componentized！
