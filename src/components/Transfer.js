import React, { Component } from 'react';
import { Modal, Button, Select, Input, Collapse, Checkbox, DatePicker, Form, Icon, Layout, List, Avatar, Row} from 'antd';
import reqwest from 'reqwest';

const { TextArea } = Input;
const Option = Select.Option;
const Panel = Collapse.Panel;
const children = [];
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const FormItem = Form.Item;

const { Content, Sider } = Layout;

const fakeDataUrl = 'https://randomuser.me/api/?results=12&inc=name,gender,email,nat&noinfo';



for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
  console.log(`selected ${value}`);
}

function callback(key) {
  console.log(key);
}


class Transfer extends Component {
  state = {
    loading: false,
    visible: false,
    visible2: false,
    data: [],
    titleEnabled: false
  }

  toggleMembers = () => {
    this.setState({
      collapsedMembers: !this.state.collapsedMembers,
    });
  }

  componentDidMount() {
    this.getData((res) => {
      this.setState({
        data: res.results,
      });
    });
  }

  getData = (callback) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
      },
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  showModal2 = () => {
    this.setState({
      visible2: true,
    });
  }
  handleOk = (e) => {
    console.log(e);
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false, visible2: false });
    }, 3000);
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      visible2: false,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  enableTitleEdit = (e) => {
    this.setState({
      titleEnabled: true
    });
  }

  saveTitle = (e) => {
    console.log('Save title');
    this.setState({
      titleEnabled: false
    });
  }

  onChange = (e) => {
    console.log('target.value', e.target.value);
    switch(e.target.value) {
      case ("password"):
        this.setState({
          option_password: e.target.checked,
        });
      break;
      case ("url"):
        this.setState({
          option_url: e.target.checked,
        });
      break;
      case ("expiration"):
        this.setState({
          option_expiration: e.target.checked,
        });
      break;
      default:
      break;
    }
  }

  onChangeDate = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  }

  emitReveal = () => {
    console.log('reveal password');
  }

  render() {

    const { RangePicker } = DatePicker;

    const Password = (props) => {
      const suffix = <Icon type="close-circle" onClick={this.emitReveal} />;
      return <div>
        <div style={{ marginBottom: 12 }}>
          <Input prefix={<Icon type="lock" suffix={suffix} style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Input prefix={<Icon type="info" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Hint" />
        </div>
      </div>
    };

    const URL = (props) => {
      return <div style={{ marginBottom: 16 }}>
        <Input addonBefore={'https://be12.ch/transfer/'} addonAfter={<Icon type="copy" />} defaultValue="customname" />
      </div>
    };

    const Expiration = (props) => {
      return <FormItem extra="Restrict access to this resource by setting a date-range.">
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={['Start Time', 'End Time']}
          onChange={this.onChangeDate}
        />
      </FormItem>
    }


    return (
      <div>
        <Button type="primary" onClick={this.showModal}>New transfer</Button>
        <Button type="primary" onClick={this.showModal2}>Share on a file which already has been transfered previously</Button>
        <Modal
          title="New transfer"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          closable={false}
          footer={[
            <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
              Send
            </Button>,
          ]}
          >
          <div style={{ marginBottom: 18 }}>
            <Input size="large" placeholder="Title" />
          </div>
          <Form layout={'vertical'}>
            <FormItem label="Receiver(s):">
              <Select
                mode="tags"
                style={{ width: '100%' }}
                onChange={handleChange}
                tokenSeparators={[',']}
                placeholder="Be12 ID, Name or Email"
                >
                {children}
              </Select>
            </FormItem>
            <FormItem label="Private message:">
              <TextArea rows={4} placeholder="This message will be cihpered and is entirely private between you and the receiver(s)." />
            </FormItem>
          </Form>
          <Collapse defaultActiveKey={['1']} onChange={callback}>
            <Panel header="Advanced options" key="2">
              <p>{text}</p>
              
              <div>
                <Checkbox value="password" onChange={this.onChange}>Protect with password</Checkbox>
                { this.state.option_password ? <Password/> : null }
              </div>
              <div>
                <Checkbox value="url" onChange={this.onChange}>Use URL link</Checkbox>
                { this.state.option_url ? <URL/> : null }
              </div>
              <div>
                <Checkbox value="members_visible" onChange={this.onChange}>Allow to see with whom this resource is being shared</Checkbox>
              </div>
              <div>
                <Checkbox value="notification" onChange={this.onChange}>Receive email on open</Checkbox>
              </div>
              <div>
                <Checkbox value="expiration" onChange={this.onChange}>Expiration date</Checkbox>
                { this.state.option_expiration ? <Expiration/> : null }
              </div>
            </Panel>
          </Collapse>
        </Modal>








        <Modal
          title="Share file"
          width="75%"
          maxWidth="1100"
          visible={this.state.visible2}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          closable={false}
          className="share-modal-2"
          >
          <Layout>
            <Sider width={'55%'} style={{ background: '#fff', borderRight: '1px solid #d9d9d9' }}>
              <div className="share-description">
                <h2>Filename_123432.ext</h2>
                <ul>
                  <li>option1</li>
                  <li>option1</li>
                  <li>option1</li>
                  <li>option1</li>
                </ul>
              </div>
              <Collapse bordered={false} defaultActiveKey={['2']} onChange={callback}>
                <Panel showArrow={false} header="Settings" key="1">
                  <Form layout={'vertical'} onSubmit={this.handleSubmit}>
                    <FormItem
                      label="Title:"
                    >
                      <Input placeholder="Title" value="Filename_123432.ext" />
                    </FormItem>
                  </Form>
                  <div>
                    <Checkbox value="password" onChange={this.onChange}>Protect with password</Checkbox>
                    { this.state.option_password ? <Password/> : null }
                  </div>
                  <div>
                    <Checkbox value="url" onChange={this.onChange}>Use URL link</Checkbox>
                    { this.state.option_url ? <URL/> : null }
                  </div>
                  <div>
                    <Checkbox value="notification" onChange={this.onChange}>Receive email on open</Checkbox>
                  </div>
                  <div>
                    <Checkbox value="expiration" onChange={this.onChange}>Expiration date</Checkbox>
                    { this.state.option_expiration ? <Expiration/> : null }
                  </div>
                </Panel>
                <Panel showArrow={false} header="Sharing with" className="members-panel" key="2">
                  <List
                    className="demo-list"
                    itemLayout="horizontal"
                    dataSource={this.state.data}
                    renderItem={item => (
                      <List.Item actions={[<Icon type="edit" />, <Icon type="close" />]}>
                        <List.Item.Meta
                          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                          title={<a href="https://ant.design">{item.name.last}</a>}
                          description="International Relations - Be12 Company"
                        />
                        <Row>
                          <Checkbox value="notification" onChange={this.onChange}>Receive email on open</Checkbox>
                        </Row>
                        <Row>
                          <TextArea rows={2} placeholder="This message will be cihpered and is entirely private between you and the receiver(s)." />
                        </Row>
                      </List.Item>
                    )}
                  />
                </Panel>
              </Collapse>
            </Sider>
            <Layout style={{ background: '#fff'}}>
              <Content style={{ margin: '0 16px' }}>
                <h2>Share information with a new member</h2>
                <Form layout={'vertical'}>
                  <FormItem label="Receiver(s):">
                    <Select
                      mode="tags"
                      style={{ width: '100%' }}
                      onChange={handleChange}
                      tokenSeparators={[',']}
                      placeholder="Be12 ID, Name or Email"
                      >
                      {children}
                    </Select>
                  </FormItem>
                  <FormItem label="Private message:">
                    <TextArea rows={4} placeholder="This message will be cihpered and is entirely private between you and the receiver(s)." />
                  </FormItem>
                </Form>
              </Content>
            </Layout>
          </Layout>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Transfer);