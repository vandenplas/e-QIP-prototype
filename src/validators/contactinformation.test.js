import ContactInformationValidator from './contactinformation'

describe('Contact Information validation', function () {
  it('should validate emails', function () {
    const tests = [
      {
        state: {
          Emails: [
            {
              Item: {
                value: 'foobar@local.dev'
              }
            },
            {
              Item: {
                value: 'foobar@local.dev'
              }
            }
          ]
        },
        expected: true
      },
      {
        state: {
          Emails: [
            {
              Item: {
                value: 'foobar@local.dev'
              }
            }
          ]
        },
        expected: false
      },
      {
        state: {
          Emails: [
            {
              Item: null
            },
            {
              Item: {
                value: 'foobar@local.dev'
              }
            }
          ]
        },
        expected: false
      }
    ]

    tests.forEach(test => {
      expect(new ContactInformationValidator(test.state, null).validEmails()).toBe(test.expected)
    })
  })

  it('should validate phone numbers', function () {
    const tests = [
      {
        state: {
          PhoneNumbers: [
            {
              Item: {
                noNumber: '',
                number: '7031112222',
                numberType: 'Home',
                type: 'Domestic',
                timeOfDay: 'Both',
                extension: ''
              }
            },
            {
              Item: {
                noNumber: '',
                number: '7031112222',
                numberType: 'Home',
                type: 'Domestic',
                timeOfDay: 'Both',
                extension: ''
              }
            }
          ]
        },
        expected: true
      },
      {
        state: {
          PhoneNumbers: [
            {
              Item: {
                noNumber: '',
                number: '7031112222',
                numberType: 'Home',
                type: 'Domestic',
                timeOfDay: 'Both',
                extension: ''
              }
            }
          ]
        },
        expected: true
      },
      {
        state: {
          PhoneNumbers: [
            {
              Item: {
                noNumber: '',
                number: '7031112222',
                numberType: 'Home',
                type: 'Domestic',
                timeOfDay: 'Both',
                extension: ''
              }
            },
            {
              Telephone: null
            }
          ]
        },
        expected: true
      },
      {
        state: {
          PhoneNumbers: null
        },
        expected: false
      }
    ]

    tests.forEach(test => {
      expect(new ContactInformationValidator(test.state, null).validPhoneNumbers()).toBe(test.expected)
    })
  })

  it('should validate contact information', function () {
    const tests = [
      {
        state: {
          Emails: [
            {
              Item: {
                value: 'foobar2@local.dev'
              }
            },
            {
              Item: {
                value: 'foobar2@local.dev'
              }
            }
          ],
          PhoneNumbers: [
            {
              Item: {
                noNumber: '',
                number: '7031112222',
                numberType: 'Home',
                type: 'Domestic',
                timeOfDay: 'Both',
                extension: ''
              }
            },
            {
              Item: {
                noNumber: '',
                number: '7031112222',
                numberType: 'Home',
                type: 'Domestic',
                timeOfDay: 'Both',
                extension: ''
              }
            }
          ]
        },
        expected: true
      }
    ]

    tests.forEach(test => {
      expect(new ContactInformationValidator(test.state, null).isValid()).toBe(test.expected)
    })
  })
})
