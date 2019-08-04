import React from 'react';
import { connect } from 'dva';
import { Layout, Row, Col, message, Menu, Icon, Input, Avatar } from 'antd';
import styles from './BlankLayout.less';
import logo from '../assets/logo.svg';
import userPic from '../assets/pic.png';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

// 右侧导航信息
const sliderMenuData = [
  {
    key: 'user',
    type: 'user',
    url: '/set/user',
    sourcePath: 'set',
  },
  {
    key: 'authority',
    type: 'apartment',
    url: '/set/authority',
    sourcePath: 'set',
  },
  {
    key: 'role',
    type: 'team',
    url: '/set/role',
    sourcePath: 'set',
  },
  {
    key: 'workspace',
    type: 'appstore',
    url: '/work/workspace',
    sourcePath: 'work',
  },
  {
    key: 'repository',
    type: 'database',
    url: '/work/repository',
    sourcePath: 'work',
  },
  {
    key: 'dataSet',
    type: 'cluster',
    url: '/work/dataSet',
    sourcePath: 'work',
  },
  {
    key: 'visual',
    type: 'project',
    url: '/work/visual',
    sourcePath: 'work',
  },
  {
    key: 'display',
    type: 'desktop',
    url: '/work/display',
    sourcePath: 'work',
  },
];

@connect(({ global }) => ({ global }))
export default class BlankLayout extends React.Component {
  state = {
    current: 'home',
    currentSlider: '',
  };

  componentWillMount() {
    this.getMenuName();
  }

  // 根据路径判断当前激活状态的导航
  getMenuName = () => {
    const pathname = this.props.history.location.pathname.replace('/', '');
    const currentPath =
      pathname.indexOf('/') > 0 ? pathname.slice(0, pathname.indexOf('/')) : pathname;
    const currentSlider =
      pathname.lastIndexOf('/') > 0
        ? pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length)
        : pathname;
    this.setState({
      current: currentPath,
      currentSlider,
    });
  };

  render() {
    const { children, history, global } = this.props;
    const { showLeftMenu } = global;
    const { current, currentSlider } = this.state;
    // 监听pathname并生成对应左侧导航
    const renderSliderMenu = () => {
      const pathName = history.location.pathname;
      const menuDoms = [];
      const currentData = sliderMenuData.filter(t => pathName.indexOf(`${t.sourcePath}`) > 0);
      currentData.map(item => {
        const dom = (
          <Menu.Item key={item.key} onClick={() => history.push(item.url)}>
            <Icon type={item.type} />
          </Menu.Item>
        );
        return menuDoms.push(dom);
      });
      return menuDoms.length > 0 ? (
        <Sider width={50} style={{ position: 'absolute', top: 50, background: '#fff' }}>
          <Menu
            mode="vertical"
            className={styles.calcMenuHeight}
            onClick={this.getMenuName}
            selectedKeys={[currentSlider]}
          >
            {menuDoms}
          </Menu>
        </Sider>
      ) : (
        ''
      );
    };
    const layout = (
      <Layout>
        <Header className={styles.homeHeader}>
          <img src={logo} className={styles.logo} alt="logo" />
          <Menu
            mode="horizontal"
            onClick={this.getMenuName}
            selectedKeys={[current]}
            className={styles.homeMenu}
          >
            <Menu.Item key="home" onClick={() => history.push('/home')}>
              <Icon type="home" />
              首页
            </Menu.Item>
            <Menu.Item key="work" onClick={() => history.push('/work')}>
              <Icon type="laptop" />
              工作区
            </Menu.Item>
            <Menu.Item key="set" onClick={() => history.push('/set')}>
              <Icon type="setting" />
              系统管理
            </Menu.Item>
          </Menu>
          <Menu mode="horizontal" selectedKeys={['']} className={styles.homeUser}>
            <SubMenu
              title={
                <span className="submenu-title-wrapper">
                  <Avatar src={userPic} style={{ marginRight: 10, backgroundColor: '#87d068' }} />
                  <span className={styles.userName}>admin</span>
                </span>
              }
            >
              <Menu.ItemGroup>
                <Menu.Item key="user" onClick={this.showUserModal}>
                  <Icon type="user" />
                  用户信息
                </Menu.Item>
                <Menu.Item key="passward" onClick={this.showPasswordModal}>
                  <Icon type="unlock" />
                  修改密码
                </Menu.Item>
                <Menu.Item key="back" onClick={this.logout}>
                  <Icon type="poweroff" />
                  退出登录
                </Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
          </Menu>
        </Header>
        <Layout className={styles.homeSlider}>
          {renderSliderMenu()}
          <Layout style={{ padding: showLeftMenu ? '10px 0 0 50px' : '10px 10px 0' }}>
            <Content
              style={{
                minHeight: 280,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
    return (
      <Layout className={styles.BlankLayout}>
        <Content>
          <div className={styles.BlankLayout}>{layout}</div>
        </Content>
      </Layout>
    );
  }
}
