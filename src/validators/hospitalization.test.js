import HospitalizationsValidator, { HospitalizationValidator } from './hospitalization'
import Location from '../components/Form/Location'

describe('Hospitalization validation', function () {
  it('should validate admission', function () {
    const tests = [
      {
        state: {
          Admission: 'Voluntary',
          Explanation: {
            value: 'Because I can'
          }
        },
        expected: true
      },
      {
        state: {
          Admission: 'Foo',
          Explanation: {
            value: 'Because I can'
          }
        },
        expected: false
      }
    ]

    tests.forEach(test => {
      expect(new HospitalizationValidator(test.state, null).validAdmission()).toBe(test.expected)
    })
  })

  it('should validate hospitalization', function () {
    const tests = [
      {
        state: {
          Facility: {
            value: 'Place 1'
          },
          FacilityAddress: {
            country: { value: 'United States' },
            street: '1234 Some Rd',
            city: 'Arlington',
            state: 'Virginia',
            zipcode: '22202',
            layout: Location.ADDRESS
          },
          TreatmentDate: {
            from: {
              date: new Date('1/1/2010')
            },
            to: {
              date: new Date('1/1/2012')
            },
            present: false
          },
          Admission: 'Voluntary',
          Explanation: {
            value: 'Because I can'
          }
        },
        expected: true
      }
    ]

    tests.forEach(test => {
      expect(new HospitalizationValidator(test.state, null).isValid()).toBe(test.expected)
    })
  })

  it('should validate hospitalized branch', function () {
    const tests = [
      {
        state: {
          Hospitalized: 'Yes'
        },
        expected: true
      },
      {
        state: {
          Hospitalized: 'Nope'
        },
        expected: false
      }
    ]

    tests.forEach(test => {
      expect(new HospitalizationsValidator(test.state, null).validHospitalization()).toBe(test.expected)
    })
  })
  it('should validate hospitalizations', function () {
    const tests = [
      {
        state: {
          Hospitalized: 'Yes',
          List: [
            {
              Item: {
                Facility: {
                  value: 'Place 1'
                },
                FacilityAddress: {
                  country: { value: 'United States' },
                  street: '1234 Some Rd',
                  city: 'Arlington',
                  state: 'Virginia',
                  zipcode: '22202',
                  layout: Location.ADDRESS
                },
                TreatmentDate: {
                  from: {
                    date: new Date('1/1/2010')
                  },
                  to: {
                    date: new Date('1/1/2012')
                  },
                  present: false
                },
                Admission: 'Voluntary',
                Explanation: {
                  value: 'Because I can'
                }
              }
            }
          ],
          ListBranch: 'No'
        },
        expected: true
      },
      {
        state: {
          Hospitalized: 'Nope',
          List: [
            {
              Item: {
                Facility: {
                  value: 'Place 1'
                },
                FacilityAddress: {
                  country: { value: 'United States' },
                  street: '1234 Some Rd',
                  city: 'Arlington',
                  state: 'Virginia',
                  zipcode: '22202',
                  layout: Location.ADDRESS
                },
                TreatmentDate: {
                  from: {
                    date: new Date('1/1/2010')
                  },
                  to: {
                    date: new Date('1/1/2012')
                  },
                  present: false
                },
                Admission: 'Voluntary',
                Explanation: {
                  value: 'Because I can'
                }
              }
            }
          ],
          ListBranch: ''
        },
        expected: false
      },
      {
        state: {
          Hospitalized: 'Yes',
          List: [
            {
              Facility: {
                value: null
              },
              FacilityAddress: {
                country: { value: 'United States' },
                street: '1234 Some Rd',
                city: 'Arlington',
                state: 'Virginia',
                zipcode: '22202',
                layout: Location.ADDRESS
              },
              TreatmentDate: {
                from: {
                  date: new Date('1/1/2010')
                },
                to: {
                  date: new Date('1/1/2012')
                },
                present: false
              },
              Admission: 'Voluntary',
              Explanation: {
                value: 'Because I can'
              }
            }
          ],
          ListBranch: ''
        },
        expected: false
      },
      {
        state: {
          Hospitalized: 'Yes',
          ListBranch: 'No',
          List: [
            {
              Facility: {
                value: null
              },
              FacilityAddress: {
                country: { value: 'United States' },
                street: '1234 Some Rd',
                city: 'Arlington',
                state: 'Virginia',
                zipcode: '22202',
                layout: Location.ADDRESS
              },
              Admission: 'Voluntary',
              Explanation: {
                value: 'Because I can'
              }
            }
          ]
        },
        expected: false
      },
      {
        state: {
          Hospitalized: 'Yes',
          List: [],
          ListBranch: ''
        },
        expected: false
      },
      {
        state: {
          Hospitalized: 'No',
          List: [],
          ListBranch: ''
        },
        expected: true
      }
    ]

    tests.forEach(test => {
      expect(new HospitalizationsValidator(test.state, null).isValid()).toBe(test.expected)
    })
  })
})
