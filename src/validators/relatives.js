import NameValidator from './name'
import LocationValidator, { isInternational } from './location'
import DateRangeValidator from './daterange'
import { validDateField, validGenericTextfield } from './helpers'

export default class RelativesValidator {
  constructor (data = {}) {
    this.list = data.List || []
    this.listBranch = data.ListBranch
  }

  validItems () {
    if (this.list.length === 0) {
      return false
    }

    if (this.listBranch !== 'No') {
      return false
    }

    for (const relative of this.list) {
      if (new RelativeValidator(relative.Item, null).isValid() !== true) {
        return false
      }
    }

    return true
  }

  isValid () {
    return this.validItems()
  }
}

export class RelativeValidator {
  constructor (data = {}) {
    this.relation = data.Relation || []
    this.name = data.Name
    this.birthdate = data.Birthdate
    this.birthplace = data.Birthplace
    this.citizenship = data.Citizenship
    this.maidenSameAsListed = data.MaidenSameAsListed
    this.maidenName = data.MaidenName
    this.aliases = data.Aliases || []
    this.isDeceased = data.IsDeceased
    this.address = data.Address
    this.citizenshipDocumentation = data.CitizenshipDocumentation
    this.otherCitizenshipDocumentation = data.OtherCitizenshipDocumentation
    this.documentNumber = data.DocumentNumber
    this.courtName = data.CourtName
    this.courtAddress = data.CourtAddress
    this.document = data.Document
    this.otherDocument = data.OtherDocument
    this.residenceDocumentNumber = data.ResidenceDocumentNumber
    this.expiration = data.Expiration
    this.firstContact = data.FirstContact
    this.lastContact = data.LastContact
    this.methods = data.Methods || []
    this.methodsComments = data.MethodsComments
    this.frequency = data.Frequency
    this.frequencyComments = data.FrequencyComments
    this.employer = data.Employer
    this.employerAddress = data.EmployerAddress
    this.hasAffiliation = data.HasAffiliation
    this.employerRelationship = data.EmployerRelationship
  }

  citizen () {
    return !!this.citizenship && !!this.citizenship.value && this.citizenship.value.some(x => x === 'United States')
  }

  requiresCitizenshipDocumentation () {
    const relations = ['Father', 'Mother', 'Child', 'Stepchild', 'Brother', 'Sister', 'Half-brother', 'Half-sister', 'Stepbrother', 'Stepsister', 'Stepmother', 'Stepfather']
    const citizen = this.citizen()
    const international = (((this.birthplace || {}).country || {}).value !== 'United States')
    const mailingCountry = ((this.address || {}).country || {}).value

    if (this.relation && relations.includes(this.relation) && citizen && international && this.isDeceased === 'Yes') {
      return true
    }

    if (this.address && mailingCountry === 'United States' && international && citizen) {
      return true
    }

    if (this.address && mailingCountry === 'POSTOFFICE' && international && citizen) {
      return true
    }

    if (this.birthplace && international && citizen) {
      return true
    }

    return false
  }

  validRelation () {
    return !!this.relation && this.relation.length > 0
  }

  validName () {
    return !!this.name && new NameValidator(this.name, null).isValid()
  }

  validBirthdate () {
    return !!this.birthdate && validDateField(this.birthdate)
  }

  validBirthplace () {
    return !!this.birthplace && new LocationValidator(this.birthplace).isValid()
  }

  validCitizenship () {
    return !!this.citizenship && !!this.citizenship.value && this.citizenship.value.length > 0
  }

  validMaidenName () {
    if (this.relation !== 'Mother') {
      return true
    }

    if (!!this.maidenSameAsListed && this.maidenSameAsListed === 'Yes') {
      return true
    }

    return !!this.maidenName && new NameValidator(this.maidenName, null).isValid()
  }

  validAliases () {
    if (this.aliases.length === 0) {
      return false
    }

    for (const alias of this.aliases) {
      const has = !!alias.Has && (alias.Has === 'No' || alias.Has === 'Yes')
      if (has && alias.Has === 'No') {
        continue
      }

      const props = { hideMaiden: this.relation === 'Mother' }
      if (has && new AliasValidator(alias.Item, props).isValid() === false) {
        return false
      }
    }

    return true
  }

  validIsDeceased () {
    return !!this.isDeceased && (this.isDeceased === 'No' || this.isDeceased === 'Yes')
  }

  validAddress () {
    if (!this.isDeceased) {
      return false
    }

    if (this.isDeceased === 'Yes') {
      return true
    }

    return !!this.address && new LocationValidator(this.address).isValid()
  }

  validCitizenshipDocumentation () {
    if (!this.requiresCitizenshipDocumentation()) {
      return true
    }

    switch (this.citizenshipDocumentation) {
      case 'Other':
        return validGenericTextfield(this.otherCitizenshipDocumentation)
      case 'FS':
      case 'DS':
      case 'NaturalizedAlien':
      case 'NaturalizedPermanent':
      case 'NaturalizedCertificate':
      case 'DerivedAlien':
      case 'DerivedPermanent':
      case 'DerivedCertificate':
        return true
      default:
        return false
    }
  }

  validDocumentNumber () {
    if (!this.requiresCitizenshipDocumentation()) {
      return true
    }

    return validGenericTextfield(this.documentNumber)
  }

  validCourtName () {
    if (!this.requiresCitizenshipDocumentation()) {
      return true
    }

    return validGenericTextfield(this.courtName)
  }

  validCourtAddress () {
    if (!this.requiresCitizenshipDocumentation()) {
      return true
    }

    return new LocationValidator(this.courtAddress, null).isValid()
  }

  validDocument () {
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    switch (this.document) {
      case 'Other':
        return validGenericTextfield(this.otherDocument)
      case 'Permanent':
      case 'Employment':
      case 'Arrival':
      case 'Visa':
      case 'F1':
      case 'J1':
        return true
      default:
        return false
    }
  }

  validResidenceDocumentNumber () {
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    return !!this.residenceDocumentNumber && validGenericTextfield(this.residenceDocumentNumber)
  }

  validExpiration () {
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    return !!this.expiration && validDateField(this.expiration)
  }

  validFirstContact () {
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    if (this.address && !isInternational(this.address)) {
      return true
    }

    return !!this.firstContact && validDateField(this.firstContact)
  }

  validLastContact () {
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    if (this.address && !isInternational(this.address)) {
      return true
    }

    return !!this.lastContact && validDateField(this.lastContact)
  }

  validMethods () {
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    if (this.address && !isInternational(this.address)) {
      return true
    }

    return this.methods.length > 0 &&
      ((this.methods.some(x => x === 'Other') && !!this.methodsComments && this.methodsComments.length > 0) ||
       (this.methods.every(x => x !== 'Other')))
  }

  validFrequency () {
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    if (this.address && !isInternational(this.address)) {
      return true
    }

    return !!this.frequency && this.frequency.length > 0 &&
      ((this.frequency === 'Other' && !!this.frequencyComments && this.frequencyComments.length > 0) ||
       (this.frequency !== 'Other'))
  }

  validEmployer () {
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    if (this.address && !isInternational(this.address)) {
      return true
    }

    return !!this.employer && validGenericTextfield(this.employer)
  }

  validEmployerAddress () {
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    if (this.address && !isInternational(this.address)) {
      return true
    }

    return !!this.employerAddress && new LocationValidator(this.employerAddress).isValid()
  }

  validEmployerRelationship () {
    if (this.citizen() || this.isDeceased === 'Yes') {
      return true
    }

    if (this.address && !isInternational(this.address)) {
      return true
    }

    if (!this.hasAffiliation) {
      return false
    }

    if (this.hasAffiliation === 'No') {
      return true
    }

    return !!this.employerRelationship && validGenericTextfield(this.employerRelationship)
  }

  isValid () {
    return this.validRelation() &&
      this.validName() &&
      this.validBirthdate() &&
      this.validBirthplace() &&
      this.validCitizenship() &&
      this.validMaidenName() &&
      this.validAliases() &&
      this.validIsDeceased() &&
      this.validAddress() &&
      this.validCitizenshipDocumentation() &&
      this.validDocumentNumber() &&
      this.validCourtName() &&
      this.validCourtAddress() &&
      this.validDocument() &&
      this.validResidenceDocumentNumber() &&
      this.validExpiration() &&
      this.validFirstContact() &&
      this.validLastContact() &&
      this.validMethods() &&
      this.validFrequency() &&
      this.validEmployer() &&
      this.validEmployerAddress() &&
      this.validEmployerRelationship()
  }
}

export class AliasValidator {
  constructor (state = {}, props = {}) {
    this.name = state.Name
    this.maidenName = state.MaidenName
    this.dates = state.Dates
    this.reason = state.Reason
    this.hideMaiden = props.hideMaiden
  }

  validName () {
    return !!this.name && new NameValidator(this.name, null).isValid()
  }

  validMaidenName () {
    if (this.hideMaiden) {
      return true
    }

    return !!this.maidenName && (this.maidenName === 'No' || this.maidenName === 'Yes')
  }

  validDates () {
    return !!this.dates && new DateRangeValidator(this.dates, null).isValid()
  }

  validReason () {
    return !!this.reason && validGenericTextfield(this.reason)
  }

  isValid () {
    return this.validName() &&
      this.validMaidenName() &&
      this.validDates() &&
      this.validReason()
  }
}
