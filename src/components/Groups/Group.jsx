import React, { Component } from 'react';
import Animate from 'rc-animate';
import QueueAnim from 'rc-queue-anim';
import { Modal, Button, Form, Input, InputNumber, Icon, Progress, AutoComplete, List, Avatar, Tabs, Divider, Select, Row, Col } from 'antd';

import './Group.css';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
  console.log(`selected ${value}`);
}

function callback(key) {
  console.log(key);
}

const percentLimit = 20;
const dataSource = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Group extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current         : 0,
      totalStorage    : 300,
      totalExternals  : 300,
      currentStorage  : 89,
      currentExternals: 5,
      newStorage      : 3,
      newExternals    : 5,
      loading         : false,
      visible         : false,
      edit_modal_visible         : false
    };
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  showEditGroupModal = () => {
    this.setState({
      edit_modal_visible: true,
    });
  }


  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
      edit_modal_visible: false,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let newStoragePerCent = parseInt((this.state.newStorage/this.state.totalStorage)*100, 10);
        if (newStoragePerCent > percentLimit) {
          this.setState({visible: false});
        } else {
          console.log('Next view');
          this.setState({current: 1});
        }
      }
    });
  }


  handleStorageChange = (value) => {
    console.log('storage.value', value);
    this.setState({newStorage: value});
  }

  handleExternalChange = (value) => {
    console.log('storage.value', value);
    this.setState({newExternals: value});
  }


  render() {

    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    // Only show error after a field is touched.
    const groupNameError = isFieldTouched('groupName') && getFieldError('groupName');
    const groupStorageError = isFieldTouched('groupStorage') && getFieldError('groupStorage');
    const groupExternalError = isFieldTouched('groupExternal') && getFieldError('groupExternal');

    const storageAddedPercentage = parseInt((this.state.newStorage/this.state.totalStorage)*100, 10);
    const storageTotalPercentage = parseInt(((this.state.currentStorage + this.state.newStorage)/this.state.totalStorage)*100, 10);
    const externalAddedPercentage = parseInt((this.state.newExternals/this.state.totalExternals)*100, 10);
    const externalTotalPercentage = parseInt(((this.state.currentExternals + this.state.newExternals)/this.state.totalExternals)*100, 10);

    const storagePercentageWarning = (percentLimit < storageAddedPercentage);

    const selectAfter = (
      <Select defaultValue="Read" style={{ width: 80 }}>
        <Option value="Read">Read</Option>
        <Option value="Write">Write</Option>
        <Option value="Moderator">Moderator</Option>
      </Select>
    );

    let group = {
      name: "Group name1"
    }

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>New group</Button>
        <Button type="primary" onClick={this.showEditGroupModal}>Edit group</Button>


        <Modal
          title="New group"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          closable={false}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              { this.state.current === 0 && 'Cancel'}
              { this.state.current === 1 && 'Close' }
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={this.state.loading}
              onClick={this.handleSubmit}
              disabled={hasErrors(getFieldsError())}>
              { this.state.current === 0 && !storagePercentageWarning && 'Create'}
              { this.state.current === 0 && storagePercentageWarning && 'Submit petition'}
              { this.state.current === 1 && 'Done' }
            </Button>,
          ]}>

          <QueueAnim className="demo-content" type={['alpha', 'top']}>
            {this.state.current === 0 ? [<div key='a'>
              <Form onSubmit={this.handleSubmit}>
                <FormItem
                  validateStatus={groupNameError ? 'error' : ''}
                  help={groupNameError || ''}>
                  {getFieldDecorator('groupName', {
                    rules: [{ required: true, message: 'Please input your group name!' }],
                  })(
                    <Input placeholder="Name" size="large"/>
                  )}
                </FormItem>
                <div className="group-basic-form">
                  <FormItem
                    {...formItemLayout}
                    validateStatus={groupStorageError ? 'error' : ''}
                    help={groupStorageError || ''}
                    label="Space:">
                    {getFieldDecorator('groupStorage', {
                      rules: [{ required: true, message: 'Please input an amount!' }],
                    })(
                      <InputNumber
                        min={1}
                        max={this.state.totalStorage}
                        initialValue={this.state.newStorage}
                        onChange={this.handleStorageChange}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    validateStatus={groupExternalError ? 'error' : ''}
                    help={groupExternalError || ''}
                    label="Externals:">
                    {getFieldDecorator('groupExternal', {
                      rules: [{ required: true, message: 'Please input an amount!' }],
                    })(
                      <InputNumber
                        min={0}
                        max={this.state.totalExternals}
                        initialValue={this.state.newExternals}
                        onChange={this.handleExternalChange}
                      />
                    )}
                  </FormItem>
                </div>
              </Form>
              <Animate
                component=""
                transitionName="fade">
              {
              storagePercentageWarning ? 
              <div className="resource-warning">
                <Icon type="warning" />You are requesting a large sized group, someone with group management permission will have to approve this petition.
              </div> : null}
              </Animate>
              <div className="company-resources">
                <div>
                  <span>Company storage</span><span className="detail-text">(15GB of 50 left)</span>
                  <Progress percent={storageTotalPercentage} successPercent={storageTotalPercentage - storageAddedPercentage} size="small" />
                </div>
                <div>
                  <span>Invite links</span><span className="detail-text">(250 links of 500 left)</span>
                  <Progress percent={externalTotalPercentage} successPercent={externalTotalPercentage - externalAddedPercentage} size="small" />
                </div>
              </div>
              
            </div>] : [<div key="c">
            <Icon type="smile-o" style={{ fontSize: 26, color: '#08c' }} />
            <p>You've successfully created a group.</p>
            <a href="">Add members</a>
            <AutoComplete
              style={{ width: 200 }}
              dataSource={dataSource}
              placeholder="try to type `b`"
              filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            />
            <div style={{ maxHeight: '300'}}>
              <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                      title={<a href="https://ant.design">{item.title}</a>}
                    />
                  </List.Item>
                )}
              />
              </div>
            </div>]}
          </QueueAnim>
        </Modal>


        <Modal
          title="Basic Modal"
          visible={this.state.edit_modal_visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={740}>
          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Overview" key="1">
              <Form layout={'vertical'}>
                <FormItem label="Name">
                  <Input placeholder="input placeholder" size="large" initialValue={group.name} />
                </FormItem>
              </Form>
              <Divider orientation="left">Group resources</Divider>
              <Row type="flex" justify-content="space-around" align="middle">
                <Col span="4">
                  <Progress type="dashboard" percent={30} width={80} />
                </Col>
                <Col span="8">
                  <Row type="flex" align="middle">
                    <Form layout="inline">
                      <FormItem
                        validateStatus={groupStorageError ? 'error' : ''}
                        help={groupStorageError || ''}>
                          <InputNumber
                            min={1}
                            max={this.state.totalStorage}
                            initialValue={this.state.newStorage}
                            onChange={this.handleStorageChange}
                          />
                      </FormItem>
                    </Form>
                    <label>GB</label>
                  </Row>
                </Col>
                <Col span="4">
                  <Progress type="dashboard" percent={1} width={80} />
                </Col>
                <Col span="8">
                  <Row type="flex" align="middle">
                    <Form layout="inline">
                      <FormItem
                        validateStatus={groupExternalError ? 'error' : ''}
                        help={groupExternalError || ''}>
                          <InputNumber
                            min={0}
                            max={this.state.totalExternals}
                            initialValue={this.state.newExternals}
                            onChange={this.handleExternalChange}
                          />
                      </FormItem>
                    </Form>
                    <label>
                      Links
                    </label>
                  </Row>
                </Col>
              </Row>
              <Row type="flex" justify-content="space-around" align="middle">
                <Col span="4">
                  12Gb available
                </Col>
                <Col span="4" offset={8}>
                  98 Links available
                </Col>
                </Row>
              <div className="company-resources">
                <div>
                  <span>Company storage</span><span className="detail-text">(15GB of 50 left)</span>
                  <Progress percent={storageTotalPercentage} successPercent={storageTotalPercentage - storageAddedPercentage} size="small" />
                </div>
                <div>
                  <span>Invite links</span><span className="detail-text">(250 links of 500 left)</span>
                  <Progress percent={externalTotalPercentage} successPercent={externalTotalPercentage - externalAddedPercentage} size="small" />
                </div>
              </div>
            </TabPane>
            <TabPane tab="Applications" key="2">Content of Tab Pane 1</TabPane>
            <TabPane tab="Members" key="3">Content of Tab Pane 2
            <div style={{ marginBottom: 16 }}>
              <Input addonAfter={selectAfter} defaultValue="mysite" />
            </div>
            </TabPane>
            <TabPane tab="Rules" key="4">
              <Button type="primary" onClick={this.addRule}>Add Rule</Button>
              <Row type="flex" justify="space-around" align="middle">
                Add
                <Select
                  mode="multiple"
                  style={{ width: 250 }}
                  placeholder="Please select"
                  defaultValue={['a10', 'c12']}
                  onChange={handleChange}
                >
                  {children}
                </Select>
                from
                <Select defaultValue="0" style={{ width: 120 }} onChange={handleChange}>
                  <Option value="0">Anywhere</Option>
                  <Option value="1">Headquarters</Option>
                  <Option value="2">Plaza España</Option>
                  <Option value="3">Torre Mapre</Option>
                </Select>
                Delete
              </Row>

            </TabPane>
          </Tabs>
        </Modal>

      </div>
    );
  }
}

export default Form.create()(Group);