import React from 'react'
import ValidationElement from '../ValidationElement'
import Checkbox from '../Checkbox'

export default class HairColor extends ValidationElement {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      value: props.value || []
    }
  }

  handleChange (event) {
    let color = event.target.id.split('-')[1]
    let selected = [...this.state.value]

    if (selected.includes(color)) {
      // Remove the color if it was previously selected
      selected.splice(selected.indexOf(color), 1)
    } else {
      // Add the color if it wasn't already
      selected.push(color)
    }

    this.setState({value: selected}, () => {
      if (this.props.onUpdate) {
        this.props.onUpdate(selected)
      }
    })
  }

  hasColor (color) {
    return this.state.value.includes(color)
  }

  render () {
    return (
      <div>
        <h2>Hair Color</h2>
        <div className="option-list">
          <Checkbox name="hair-bald"
                    label="Bald"
                    value="Bald"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-black"
                    label="Black"
                    value="Black"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-blonde"
                    label="Blonde or strawberry"
                    value="Blonde"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-brown"
                    label="Brown"
                    value="Brown"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-gray"
                    label="Gray or partially gray"
                    value="Gray"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-red"
                    label="Red or auburn"
                    value="Red"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-sandy"
                    label="Sandy"
                    value="Sandy"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-white"
                    label="White"
                    value="White"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-blue"
                    label="Blue"
                    value="Blue"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-green"
                    label="Green"
                    value="Green"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-orange"
                    label="Orange"
                    value="Orange"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-pink"
                    label="Pink"
                    value="Pink"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-purple"
                    label="Purple"
                    value="Purple"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
          <Checkbox name="hair-unknown"
                    label="Unspecified or unknown"
                    value="Unknown"
                    help={this.props.help}
                    disabled={this.props.disabled}
                    onChange={this.handleChange}
                    onValidation={this.props.onValidation}
                    onBlur={this.props.onBlur}
                    onFocus={this.props.onFocus}
                    />
        </div>
      </div>
    )
  }
}
