import LegalAssociationsEngagedValidator, { EngagedValidator } from './legalassociationsengaged'
import { battery } from './helpers'

describe('Legal associations engaged component validation', function () {
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

    battery(tests, EngagedValidator, 'validDates')
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

    battery(tests, EngagedValidator, 'validReasons')
  })

  it('validate associations engaged in terrorism', () => {
    const tests = [
      {
        state: {},
        expected: false
      },
      {
        state: {
          HasEngaged: 'No'
        },
        expected: true
      },
      {
        state: {
          HasEngaged: 'Yes',
          List: [],
          ListBranch: 'No'
        },
        expected: false
      },
      {
        state: {
          HasEngaged: 'Yes',
          List: [{}],
          ListBranch: ''
        },
        expected: false
      },
      {
        state: {
          HasEngaged: 'Yes',
          List: [
            {
              Item: {
                Reasons: {
                  value: 'this is the reasons'
                },
                Dates: {
                  from: {
                    date: new Date('1/1/2010')
                  },
                  to: {
                    date: new Date('1/1/2012')
                  },
                  present: false
                }
              }
            }
          ],
          ListBranch: 'No'
        },
        expected: true
      }
    ]

    battery(tests, LegalAssociationsEngagedValidator, 'isValid')
  })
})
