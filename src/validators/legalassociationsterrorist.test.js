import LegalAssociationsTerroristValidator, { TerroristValidator } from './legalassociationsterrorist'
import { battery } from './helpers'
import Location from '../components/Form/Location'

describe('Legal associations terrorist component validation', function () {
  it('validate organization', () => {
    const tests = [
      {
        state: {
          Organization: {}
        },
        expected: false
      },
      {
        state: {
          Organization: {
            value: 'this is an organization'
          }
        },
        expected: true
      }
    ]

    battery(tests, TerroristValidator, 'validOrganization')
  })

  it('validate address', () => {
    const tests = [
      {
        state: {
          Address: {}
        },
        expected: false
      },
      {
        state: {
          Address: {
            country: { value: 'United States' },
            street: '1234 Some Rd',
            city: 'Arlington',
            state: 'Virginia',
            zipcode: '22202',
            layout: Location.ADDRESS
          }
        },
        expected: true
      }
    ]

    battery(tests, TerroristValidator, 'validAddress')
  })

  it('validate dates', () => {
    const tests = [
      {
        state: {
          Dates: {}
        },
        expected: false
      },
      {
        state: {
          Dates: {
            from: {
              date: new Date('1/1/2010')
            },
            to: {
              date: new Date('1/1/2012')
            },
            present: false
          }
        },
        expected: true
      }
    ]

    battery(tests, TerroristValidator, 'validDates')
  })

  it('validate positions', () => {
    const tests = [
      {
        state: {
          Positions: {}
        },
        expected: false
      },
      {
        state: {
          PositionsNotApplicable: {
            applicable: false
          },
          Positions: {}
        },
        expected: true
      },
      {
        state: {
          Positions: {
            value: 'this is positions'
          }
        },
        expected: true
      }
    ]

    battery(tests, TerroristValidator, 'validPositions')
  })

  it('validate contributions', () => {
    const tests = [
      {
        state: {
          Contributions: {}
        },
        expected: false
      },
      {
        state: {
          ContributionsNotApplicable: {
            applicable: false
          },
          Contributions: {}
        },
        expected: true
      },
      {
        state: {
          Contributions: {
            value: 'this is contributions'
          }
        },
        expected: true
      }
    ]

    battery(tests, TerroristValidator, 'validContributions')
  })

  it('validate reasons', () => {
    const tests = [
      {
        state: {
          Reasons: {}
        },
        expected: false
      },
      {
        state: {
          Reasons: {
            value: 'this is the reasons'
          }
        },
        expected: true
      }
    ]

    battery(tests, TerroristValidator, 'validReasons')
  })

  it('validate associations to terrorist organizations', () => {
    const tests = [
      {
        state: {},
        expected: false
      },
      {
        state: {
          HasTerrorist: 'No'
        },
        expected: true
      },
      {
        state: {
          HasTerrorist: 'Yes',
          List: [],
          ListBranch: 'No'
        },
        expected: false
      },
      {
        state: {
          HasTerrorist: 'Yes',
          List: [{}],
          ListBranch: ''
        },
        expected: false
      },
      {
        state: {
          HasTerrorist: 'Yes',
          List: [
            {
              Item: {
                Organization: {
                  value: 'this is an organization'
                },
                Address: {
                  country: { value: 'United States' },
                  street: '1234 Some Rd',
                  city: 'Arlington',
                  state: 'Virginia',
                  zipcode: '22202',
                  layout: Location.ADDRESS
                },
                Dates: {
                  from: {
                    date: new Date('1/1/2010')
                  },
                  to: {
                    date: new Date('1/1/2012')
                  },
                  present: false
                },
                PositionsNotApplicable: {
                  applicable: false
                },
                Positions: {},
                ContributionsNotApplicable: {
                  applicable: false
                },
                Contributions: {},
                Reasons: {
                  value: 'this is the reasons'
                }
              }
            }
          ],
          ListBranch: 'No'
        },
        expected: true
      }
    ]

    battery(tests, LegalAssociationsTerroristValidator, 'isValid')
  })
})
