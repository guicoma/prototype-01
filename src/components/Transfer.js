import React, { Component } from 'react';
import { Modal, Button, Select, Input, Collapse, Checkbox, DatePicker, Form, Icon, Layout, List, Avatar, Steps} from 'antd';
import reqwest from 'reqwest';

const { TextArea }        = Input;
const Option              = Select.Option;
const Panel               = Collapse.Panel;
const FormItem            = Form.Item;
const { Content, Sider }  = Layout;
const Step                = Steps.Step;

const children = [];
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

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
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      transferName : 'default_file_or_folder_name.pdf',
      loading: false,
      visible: false,
      visible2: false,
      data: [],
      option: {},
      titleEnabled: false
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
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
    if (this.state.current < 1) {
      this.next();
    }else{
      this.setState({ loading: true });
      setTimeout(() => {
        this.setState({ loading: false, visible: false, visible2: false });
      }, 3000);
    }
  }
  handleCancel = (e) => {
    console.log(e);
    if (this.state.current > 0) {
      this.prev();
    }else{
      this.setState({
        visible: false,
        visible2: false,
      });
    }
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

  onEditTitle = (e) => {
    this.setState({
      transferName: e.target.value
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
    let optionObj  = this.state.option;
    optionObj[e.target.value] = e.target.checked;

    console.log('option', optionObj);

    this.setState({
      option: optionObj,
    });
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
      return <div style={{ marginTop: 6, marginBottom: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <Input prefix={<Icon type="lock" suffix={suffix} style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
        </div>
        <div>
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

    const BasicSettings = (props) => {
      return <Form layout={'vertical'}>
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
        <FormItem label="Concepto:">
          <Input size="large" placeholder="Descripción" defaultValue={this.state.transferName} />
        </FormItem>
        <FormItem label="Private message:">
          <TextArea rows={4} placeholder="This message will be cihpered and is entirely private between you and the receiver(s)." />
        </FormItem>
      </Form>
    }

    const AdvancedSettings = (props) => {
      return <Form layout={'vertical'}>
        <p>{text}</p>
        <div>
          <Checkbox checked={this.state.option.password} value="password" onChange={this.onChange}>Protect with password</Checkbox>
          { this.state.option.password && <Password/> }
        </div>
        <div>
          <Checkbox checked={this.state.option.url} value="url" onChange={this.onChange}>Use URL link</Checkbox>
          { this.state.option.url && <URL/> }
        </div>
        <div>
          <Checkbox checked={this.state.option.members_visible} value="members_visible" onChange={this.onChange}>Allow to see with whom this resource is being shared</Checkbox>
        </div>
        <div>
          <Checkbox checked={this.state.option.notification} value="notification" onChange={this.onChange}>Receive email on open</Checkbox>
        </div>
        <div>
          <Checkbox checked={this.state.option.expiration} value="expiration" onChange={this.onChange}>Expiration date</Checkbox>
          { this.state.option.expiration && <Expiration/> }
        </div>
      </Form>
    }

    const steps = [{
      title: 'Basic',
      content: <BasicSettings />,
    }, {
      title: 'Adv. settings',
      content: <AdvancedSettings />,
    }];


    return (
      <div>
        <Button type="primary" onClick={this.showModal}>New transfer</Button><br/>
        <Button type="primary" onClick={this.showModal2}>Share on a file which already has been transfered previously</Button>
        <Modal
          title="New transfer"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          closable={false}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              { this.state.current === 0 && 'Cancel'}
              { this.state.current === 1 && 'Previous' }
            </Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
              { this.state.current === 0 && 'Next'}
              { this.state.current === 1 && 'Send' }
            </Button>,
          ]}
          >
          <Steps current={this.state.current} size="small">
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className="steps-content" style={{marginTop: 16}}>{steps[this.state.current].content}</div>
        </Modal>








        <Modal
          title="Manage sharing"
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
                <h2>{this.state.transferName}</h2>
                <ul>
                  <li>option1</li>
                  <li>option1</li>
                  <li>option1</li>
                  <li>option1</li>
                </ul>
              </div>
              <Collapse bordered={false} defaultActiveKey={['2']} onChange={callback}>
                <Panel header="Settings" key="1">
                  <Form layout={'vertical'} onSubmit={this.handleSubmit}>
                    <FormItem
                      label="Title:"
                    >
                      <Input placeholder="Title" defaultValue={this.state.transferName} onChange={this.onEditTitle}/>
                    </FormItem>
                  </Form>
                  <div>
                    <Checkbox value="password" onChange={this.onChange}>Protect with password</Checkbox>
                    { this.state.option.password ? <Password/> : null }
                  </div>
                  <div>
                    <Checkbox value="url" onChange={this.onChange}>Use URL link</Checkbox>
                    { this.state.option.url ? <URL/> : null }
                  </div>
                  <div>
                    <Checkbox value="notification" onChange={this.onChange}>Receive email on open</Checkbox>
                  </div>
                  <div>
                    <Checkbox value="expiration" onChange={this.onChange}>Expiration date</Checkbox>
                    { this.state.option.expiration ? <Expiration/> : null }
                  </div>
                </Panel>
                <Panel header="Sharing with" className="members-panel" key="2">
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