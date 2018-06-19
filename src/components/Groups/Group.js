import React, { Component } from 'react';
import Animate from 'rc-animate';
import QueueAnim from 'rc-queue-anim';
import { Modal, Button, Form, Input, InputNumber, Icon, Progress, AutoComplete, List, Avatar } from 'antd';

import './Group.css';

const FormItem = Form.Item;

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
      visible         : false
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false
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

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>New group</Button>


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
          ]}
          >
          


          <QueueAnim className="demo-content" type={['alpha', 'top']}>
            {this.state.current === 0 ? [<div key='a'>
              <Animate
            component=""
            transitionName="fade"
          >
            {
              storagePercentageWarning ? 
              <div className="resource-warning">
                <Icon type="warning" />You are requesting a large sized group, someone with group management permission will have to approve this petition.
              </div> : null}
          </Animate>
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              validateStatus={groupNameError ? 'error' : ''}
              help={groupNameError || ''}
            >
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

      </div>
    );
  }
}

export default Form.create()(Group);