import React from 'react'
import { mount } from 'enzyme'
import EmploymentItem from './EmploymentItem'

describe('The employment component', () => {
  it('no error on empty', () => {
    const expected = {
      name: 'employment'
    }
    const component = mount(<EmploymentItem {...expected} />)
    expect(component.find('.h3').length).toBeGreaterThan(0)
  })

  it('can populate values for Military, NationalGuard and USPHS', () => {
    let updates = 0
    const expected = {
      name: 'employment',
      EmploymentActivity: { value: 'ActiveMilitary' },
      onUpdate: () => { updates++ }
    }
    const selectors = [
      '.employment-title',
      '.employment-duty-station',
      '.employment-status',
      '.daterange',
      '.address',
      '.telephone',
      '.supervisor'
    ]

    const component = mount(<EmploymentItem {...expected} />)
    selectors.forEach(selector => {
      var len = component.find(selector).length
      expect(len).toBeGreaterThan(0)
    })

    component.find({type: 'radio', value: 'ActiveMilitary'}).simulate('change')
    expect(updates).toBe(1)
  })
})
