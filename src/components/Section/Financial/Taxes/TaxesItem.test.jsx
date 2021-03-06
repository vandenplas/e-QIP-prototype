import React from 'react'
import { mount } from 'enzyme'
import TaxesItem from './TaxesItem'

describe('The taxes item component', () => {
  it('triggers updates when changing values', () => {
    let updates = 0
    const expected = {
      name: 'taxes',
      onUpdate: (obj) => {
        updates++
      }
    }
    const component = mount(<TaxesItem {...expected} />)
    component.find('.taxes-year input[type="text"]').simulate('change', { target: { value: '2000' } })
    component.find('.taxes-reason textarea').simulate('change', { target: { value: 'Reason for not filing' } })
    component.find('.taxes-agency input').simulate('change', { target: { value: 'IRS' } })
    component.find('.taxes-taxtype input').simulate('change', { target: { value: 'Income' } })
    component.find('.taxes-amount input[type="text"]').simulate('change', { target: { value: '10000' } })
    component.find('.taxes-date .day input').simulate('change', { target: { name: 'day', value: '1' } })
    component.find('.taxes-description textarea').simulate('change', { target: { value: 'Description for not filing' } })
    component.find('.taxes-date-notapplicable .not-applicable .block label input').simulate('change')
    expect(updates).toBe(8)
  })
})
