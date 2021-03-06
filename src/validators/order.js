import LocationValidator from './location'
import { validGenericTextfield, validGenericMonthYear, BranchCollection } from './helpers'

export default class OrderValidator {
  constructor (state = {}, props) {
    this.prefix = (props || {}).prefix || 'order'
    this.courtAddress = state.CourtAddress
    this.courtName = state.CourtName
    this.disposition = state.Disposition
    this.occurred = state.Occurred
    this.appeals = state.Appeals
  }

  validCourt () {
    return validGenericTextfield(this.courtName) &&
      new LocationValidator(this.courtAddress).isValid()
  }

  validOccurred () {
    return validGenericMonthYear(this.occurred)
  }

  validDisposition () {
    if (this.prefix === 'competence') {
      return true
    }

    return validGenericTextfield(this.disposition)
  }

  validAppeals () {
    const branchValidator = new BranchCollection(this.appeals)
    if (!branchValidator.validKeyValues()) {
      return false
    }

    if (branchValidator.hasNo()) {
      return true
    }

    return branchValidator.each(item => {
      return validGenericTextfield(item.CourtName) &&
        new LocationValidator(item.CourtAddress) &&
        validGenericTextfield(item.Disposition)
    })
  }

  isValid () {
    return this.validCourt() &&
      this.validDisposition() &&
      this.validOccurred() &&
      this.validAppeals()
  }
}

export class CompetenceOrderValidator extends OrderValidator {
  constructor (data = {}) {
    super(data)
    this.prefix = 'competence'
    this.courtAddress = data.CourtAddress
    this.courtName = data.CourtName
    this.occurred = data.Occurred
    this.appeals = data.Appeals
  }

}

export class ConsultationOrderValidator extends OrderValidator {
  constructor (data = {}) {
    super(data)
    this.prefix = 'consultation'
    this.courtAddress = data.CourtAddress
    this.courtName = data.CourtName
    this.occurred = data.Occurred
    this.appeals = data.Appeals
  }

}
