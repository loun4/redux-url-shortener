import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Control, Form, Errors } from 'react-redux-form';
import classNames from 'classnames';
import { isValidURL } from '../utils/validator';

export default class LinkForm extends Component {
  static propTypes = {
    form: PropTypes.shape({}).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.onReset('linkForm');
  }

  handleSubmit = model => {
    let { linkURL } = model;
    if (!linkURL.startsWith('http://') && !linkURL.startsWith('https://')) {
      linkURL = `http://${linkURL}`;
    }

    this.props.onSubmit({ ...model, linkURL });
  };

  render() {
    const {
      form: { linkURL },
    } = this.props;

    return (
      <Form
        model="linkForm"
        className="ui form column massive separator"
        onSubmit={this.handleSubmit}
      >
        <div
          className={classNames('field', {
            error: linkURL.touched && !linkURL.valid,
          })}
        >
          <div className="ui action input">
            <Control.text
              model=".linkURL"
              className="field-input"
              autoComplete="off"
              id="link"
              placeholder="Past your original url"
              validators={{ isValidURL }}
            />
            <button className="ui button" type="submit">
              Go !
            </button>
          </div>
        </div>
        <Errors
          model="linkForm.linkURL"
          className="ui negative message mini"
          show="touched"
          messages={{
            isValidURL: 'Please enter a valid url',
          }}
        />
      </Form>
    );
  }
}
