import ForeignBusinessPoliticalValidator, { PoliticalValidator } from './foreignbusinesspolitical'
import { battery } from './helpers'

describe('Foreign business political component validation', function () {
  it('validate foreign business political position', () => {
    const tests = [
      {
        state: {
          Position: {}
        },
        expected: false
      },
      {
        state: {
          Position: {
            value: 'this is the position'
          }
        },
        expected: true
      }
    ]

    battery(tests, PoliticalValidator, 'validPosition')
  })

  it('validate foreign business political dates', () => {
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

    battery(tests, PoliticalValidator, 'validDates')
  })

  it('validate foreign business political country', () => {
    const tests = [
      {
        state: {
          Country: {}
        },
        expected: false
      },
      {
        state: {
          Country: {
            value: 'Germany'
          }
        },
        expected: true
      }
    ]

    battery(tests, PoliticalValidator, 'validCountry')
  })

  it('validate foreign business political reason', () => {
    const tests = [
      {
        state: {
          Reason: {}
        },
        expected: false
      },
      {
        state: {
          Reason: {
            value: 'this is the reason'
          }
        },
        expected: true
      }
    ]

    battery(tests, PoliticalValidator, 'validReason')
  })

  it('validate foreign business political eligibility', () => {
    const tests = [
      {
        state: {
          Eligibility: {}
        },
        expected: false
      },
      {
        state: {
          Eligibility: {
            value: 'this is the eligibility'
          }
        },
        expected: true
      }
    ]

    battery(tests, PoliticalValidator, 'validEligibility')
  })

  it('validate foreign business political', () => {
    const tests = [
      {
        state: {},
        expected: false
      },
      {
        state: {
          HasForeignPolitical: 'No'
        },
        expected: true
      },
      {
        state: {
          HasForeignPolitical: 'Yes',
          List: [],
          ListBranch: 'No'
        },
        expected: false
      },
      {
        state: {
          HasForeignPolitical: 'Yes',
          List: [{}],
          ListBranch: 'No'
        },
        expected: false
      },
      {
        state: {
          HasForeignPolitical: 'Yes',
          List: [
            {
              Item: {
                Position: {
                  value: 'this is the position'
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
                Country: {
                  value: 'Germany'
                },
                Reason: {
                  value: 'this is the reason'
                },
                Eligibility: {
                  value: 'this is the eligibility'
                }
              }
            }
          ],
          ListBranch: 'No'
        },
        expected: true
      }
    ]

    battery(tests, ForeignBusinessPoliticalValidator, 'isValid')
  })
})
