import React from 'react'
import ValidationElement from '../ValidationElement'
import Dropdown from '../Dropdown'

export default class MultipleDropdown extends ValidationElement {
  constructor (props) {
    super(props)

    this.remove = this.remove.bind(this)
    this.update = this.update.bind(this)
    this.updateToken = this.updateToken.bind(this)
  }

  update (queue) {
    this.props.onUpdate({
      value: this.props.value,
      ...queue
    })
  }

  updateToken (event, options) {
    // If one has already been selected then no need to add it again
    if (this.props.value.some(x => x === options.suggestion.value)) {
      return
    }

    const values = (this.props.value || []).concat([options.suggestion.value])
    this.update({
      value: values
    })
  }

  remove (index) {
    const arr = [...(this.props.value || [])]
    arr.splice(index, 1)

    this.update({
      value: arr
    })
  }

  render () {
    const klass = `multiple-dropdown ${this.props.className || ''}`.trim()
    const tokens = (this.props.value || []).map((x, i) => {
      return (
        <span className="token" key={`${this.props.name}-${x}`}>
          {x}
          <span className="token-delete" onClick={this.remove.bind(this, i)}>X</span>
        </span>
      )
    })

    return (
      <div className={klass}>
        <Dropdown name={this.props.name}
                  ref="dropdown"
                  label={this.props.label}
                  showComments={this.props.showComments}
                  comments={this.props.comments}
                  placeholder={this.props.placeholder}
                  disabled={this.props.disabled}
                  required={this.props.required}
                  clearOnSelection={true}
                  onSuggestionSelected={this.updateToken}
                  onError={this.props.onError}>
          { this.props.children }
        </Dropdown>
        <span className="tokens">{tokens}</span>
      </div>
    )
  }
}

MultipleDropdown.defaultProps = {
  name: 'multiple-dropdown',
  label: '',
  placeholder: '',
  maxlength: 255,
  disabled: false,
  explicit: true,
  pattern: '',
  readonly: false,
  className: '',
  input: '',
  value: [],
  showComments: false,
  comments: '',
  onUpdate: (queue) => {},
  onError: (value, arr) => { return arr }
}

MultipleDropdown.errors = [
  {
    code: 'required',
    func: (value, props) => {
      if (props.required) {
        return !!props.value && !!props.value.length
      }
      return true
    }
  }
]
