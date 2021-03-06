import React from 'react'
import { mount } from 'enzyme'
import Marital from './Marital'

describe('The relationship status component', () => {
  it('no error on empty', () => {
    const expected = {
      name: 'relatives'
    }

    const component = mount(<Marital {...expected} />)
    expect(component.find('.marital').length).toEqual(1)
  })

  it('performs updates', () => {
    let updates = 0
    const expected = {
      name: 'relatives',
      Status: 'InCivilUnion',
      onUpdate: () => { updates++ }
    }

    const component = mount(<Marital {...expected} />)
    expect(component.find('.marital').length).toEqual(1)
    component.find('.status-options input[value="InCivilUnion"]').simulate('change')
    component.find('.civil-union .civil .first input').simulate('change')
    component.find('.status-options input[value="Never"]').simulate('change')
    expect(updates).toBe(3)
  })

  it('shows divorce stuff', () => {
    let updates = 0
    const expected = {
      name: 'relatives',
      Status: 'Divorced',
      DivorcedList: [
        {
          Divorce: {
            Status: 'Divorced',
            BirthPlace: { country: 'United States' },
            Deceased: 'Yes'
          }
        }
      ],
      onUpdate: () => { updates++ }
    }

    const component = mount(<Marital {...expected} />)
    expect(component.find('.marital').length).toEqual(1)
    component.find('.status-options input[value="Divorced"]').simulate('change')
    expect(updates).toBe(2)
    expect(component.find('.accordion').length).toBe(1)
  })
})
