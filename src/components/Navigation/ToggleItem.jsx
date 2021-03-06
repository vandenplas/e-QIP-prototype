import React from 'react'
import { Show } from '../Form'

export class ToggleItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: props.visible
    }

    this.toggle = this.toggle.bind(this)
  }

  componentWillReceiveProps (next) {
    if (next && next.visible !== this.state.visible) {
      this.setState({ visible: next.visible })
    }
  }

  toggle () {
    this.setState({ visible: !this.state.visible })
  }

  render () {
    const validIcon = `${this.props.section ? '' : 'mini'} eapp-status-icon-valid`.trim()
    const errorIcon = `${this.props.section ? '' : 'mini'} eapp-status-icon-error`.trim()
    return (
      <div className={`${this.props.section ? 'section' : 'subsection'} ${this.state.visible ? 'open' : 'closed'}`}>
        <span className="section-title">
          <a href="javascript:;;;" title={this.props.title} className={this.props.className} onClick={this.toggle}>
            <Show when={this.props.number}>
              <span className="section-number">{this.props.number}</span>
            </Show>
            <span className="section-name">
              {this.props.title}
              <Show when={this.state.visible}>
                <i className="fa fa-angle-up" aria-hidden="true"></i>
              </Show>
              <Show when={!this.state.visible}>
                <i className="fa fa-angle-down" aria-hidden="true"></i>
              </Show>
            </span>
            <span className={validIcon}></span>
            <span className={errorIcon}></span>
          </a>
          <Show when={this.state.visible}>
            {this.props.children}
          </Show>
        </span>
      </div>
    )
  }
}

ToggleItem.defaultProps = {
  visible: false,
  title: '',
  section: false,
  number: 0,
  className: ''
}
