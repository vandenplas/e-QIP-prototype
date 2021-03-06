import React from 'react'
import { mount } from 'enzyme'
import Multiple from './Multiple'

describe('The multiple component', () => {
  it('no error on empty', () => {
    const expected = {
      name: 'multiple'
    }
    const component = mount(<Multiple {...expected} />)
    expect(component.find('.branch').length).toBeGreaterThan(0)
    expect(component.find('.accordion').length).toBe(0)
  })

  it('displays accordion for citizenships', () => {
    const expected = {
      name: 'multiple',
      HasMultiple: 'Yes'
    }
    const component = mount(<Multiple {...expected} />)
    expect(component.find('.accordion').length).toBe(1)
  })

  it('can trigger updates', () => {
    let updates = 0
    const expected = {
      name: 'multiple',
      HasMultiple: 'Yes',
      Citizenships: [{}],
      onUpdate: () => { updates++ }
    }
    const component = mount(<Multiple {...expected} />)
    updates = 0
    component.find('.has-multiple .yes input').simulate('change')
    expect(updates).toBe(1)
  })
})
