import React from 'react'
import { Link } from 'react-router'
import { i18n } from '../../../config'
import { ValidationElement } from '../../Form'
import Signature from './Signature'

export default class General extends ValidationElement {
  constructor (props) {
    super(props)

    this.update = this.update.bind(this)
    this.updateSignature = this.updateSignature.bind(this)
  }

  update (queue) {
    this.props.onUpdate({
      Signature: this.props.Signature,
      ...queue
    })
  }

  updateSignature (values) {
    this.update({ Signature: values })
  }

  render () {
    return (
      <div className="general-release">
        { i18n.m('releases.general.contents') }
        <Signature {...this.props.Signature}
                   onUpdate={this.updateSignature}
                   onError={this.props.onError}
                   />
      </div>
    )
  }
}

General.defaultProps = {
  Signature: {},
  onUpdate: (queue) => {},
  onError: (value, arr) => { return arr }
}
