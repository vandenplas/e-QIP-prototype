import MilitaryForeignValidator from './militaryforeign'

describe('Military foreign validation', function () {
  it('handle whether subject has foreign military', () => {
    const tests = [
      {
        state: {
          HasForeignMilitary: ''
        },
        expected: false
      },
      {
        state: {
          HasForeignMilitary: 'No'
        },
        expected: true
      },
      {
        state: {
          HasForeignMilitary: 'Yes'
        },
        expected: true
      }
    ]

    tests.forEach(test => {
      expect(new MilitaryForeignValidator(test.state, null).validForeignMilitary()).toBe(test.expected)
    })
  })

  it('handle overall validity', function () {
    const tests = [
      {
        state: {
          HasForeignMilitary: 'Yes'
        },
        expected: false
      },
      {
        state: {
          HasForeignMilitary: 'Yes',
          List: [
            {
              Item: {
                Organization: 'Military',
                Name: {
                  value: 'Army'
                },
                Dates: {
                  from: new Date('1/1/2010'),
                  to: new Date('1/1/2012'),
                  present: false
                },
                Country: {
                  value: 'Germany'
                },
                Rank: {
                  value: 'Captain'
                },
                Division: {
                  value: 'Luftwaffe'
                },
                Circumstances: {
                  value: 'Mandatory service'
                },
                ReasonLeft: {
                  value: 'Moved'
                },
                MaintainsContact: 'Yes',
                List: [
                  {
                    Item: {
                      Name: {
                        first: 'Foo',
                        firstInitialOnly: false,
                        middle: 'J',
                        middleInitialOnly: true,
                        noMiddleName: false,
                        last: 'Bar',
                        lastInitialOnly: false,
                        suffix: 'Jr'
                      },
                      Address: {
                        addressType: 'International',
                        address: '1234 Some Rd',
                        city: 'Munich',
                        country: 'Germany'
                      },
                      Title: {
                        value: 'Mr.'
                      },
                      Dates: {
                        from: new Date('1/1/2010'),
                        to: new Date('1/1/2012'),
                        present: false
                      },
                      Frequency: {
                        value: 'Monthly'
                      }
                    }
                  }
                ]
              }
            }
          ]
        },
        expected: true
      }
    ]

    tests.forEach(test => {
      expect(new MilitaryForeignValidator(test.state, null).isValid()).toBe(test.expected)
    })
  })
})
