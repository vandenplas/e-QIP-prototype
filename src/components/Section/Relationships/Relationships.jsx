import React from 'react'
import { connect } from 'react-redux'
import { i18n } from '../../../config'
import AuthenticatedView from '../../../views/AuthenticatedView'
import { ValidationElement, IntroHeader } from '../../Form'
import { push } from '../../../middleware/history'
import { updateApplication, reportErrors, reportCompletion } from '../../../actions/ApplicationActions'
import { SectionViews, SectionView } from '../SectionView'
import Relatives from './Relatives'
import RelationshipStatus from './RelationshipStatus'

class Relationships extends ValidationElement {
  constructor (props) {
    super(props)

    this.state = {
      subsection: props.subsection
    }

    this.handleTour = this.handleTour.bind(this)
    this.handleReview = this.handleReview.bind(this)
    this.onValidate = this.onValidate.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.updateMarital = this.updateMarital.bind(this)
    this.updateFriends = this.updateFriends.bind(this)
    this.updateRelatives = this.updateRelatives.bind(this)
    this.updateRelationshipStatus = this.updateRelationshipStatus.bind(this)
  }

  componentDidMount () {
    let current = this.launch(this.props.Relationships, this.props.subsection, 'relatives')
    if (current !== '') {
      this.props.dispatch(push(`/form/relationships/${current}`))
    }
  }

  handleTour (event) {
    this.props.dispatch(push('/form/relationships/relatives'))
  }

  handleReview (event) {
    this.props.dispatch(push('/form/relationships/review'))
  }

  /**
   * Report errors and completion status
   */
  onValidate (event, status, errorCodes) {
    if (!event) {
      return
    }

    if (!event.fake) {
      let errors = super.triageErrors(this.props.Section.section, [...this.props.Errors], errorCodes)
      this.props.dispatch(reportErrors(this.props.Section.section, '', errors))
    }

    let cstatus = 'neutral'
    if (this.hasStatus('relatives', status, true) &&
        this.hasStatus('marital', status, true) &&
        this.hasStatus('friends', status, true)) {
      cstatus = 'complete'
    } else if (this.hasStatus('relatives', status, false) ||
               this.hasStatus('marital', status, false) ||
               this.hasStatus('friends', status, false)) {
      cstatus = 'incomplete'
    }

    let completed = {
      ...this.props.Completed,
      ...status,
      status: cstatus
    }

    this.props.dispatch(reportCompletion(this.props.Section.section, this.props.Section.subsection, completed))
  }

  /**
   * Update storage values for a subsection
   */
  onUpdate (field, values) {
    this.props.dispatch(updateApplication('Relationships', field, values))
  }

  updateMarital (values) {
    this.onUpdate('Marital', values)
  }

  updateFriends (values) {
    this.onUpdate('Friends', values)
  }

  updateRelatives (values) {
    this.onUpdate('Relatives', values)
  }

  updateRelationshipStatus (values) {
    this.onUpdate('RelationshipStatus', values)
  }

  /**
   * Helper to test whether a subsection is complete
   */
  hasStatus (property, status, val) {
    return (this.props.Completed[property] && this.props.Completed[property].status === val)
      || (status && status[property] && status[property].status === val)
  }

  /**
   * Determine the desired behaviour when visiting the
   * root of a route
   */
  launch (storage, subsection, defaultView) {
    subsection = subsection || ''
    if (subsection === '') {
      let keys = Object.keys(storage)
      if (keys.length === 0 && storage.constructor === Object) {
        return defaultView
      }
    }

    return subsection
  }

  render () {
    return (
      <div>
        <SectionViews current={this.props.subsection} dispatch={this.props.dispatch}>
          <SectionView name="">
            <div className="relationships intro review-screen">
              <div className="usa-grid-full">
                <IntroHeader Errors={this.props.Errors}
                            Completed={this.props.Completed}
                            tour={i18n.t('relationships.tour.para')}
                            review={i18n.t('relationships.review.para')}
                            onTour={this.handleTour}
                            onReview={this.handleReview}
                            />
              </div>
            </div>
          </SectionView>

          <SectionView name="review"
                       title="Let&rsquo;s make sure everything looks right"
                       showTop="true"
                       back="relationships/relatives"
                       backLabel={i18n.t('relationships.destination.relatives')}
                       next="military/selective"
                       next={i18n.t('military.destination.selective')}
                       >
          </SectionView>

          <SectionView name="relatives"
                       back="financial/bankruptcy"
                       backLabel={i18n.t('financial.destination.bankruptcy')}
                       next="relationships/review"
                       nextLabel={i18n.t('relationships.destination.review')}>
            <Relatives name="relatives"
                       {...this.props.Relatives}
                       onUpdate={this.updateRelatives}
                       onValidate={this.handleValidation}
                       />
          </SectionView>
          <SectionView name="status"
                       back=""
                       backLabel={i18n.t('financial.destination.bankruptcy')}
                       next="relationships/relatives"
                       nextLabel={i18n.t('relationships.destination.relatives')}>
            <RelationshipStatus name="status"
                       {...this.props.RelationshipStatus}
                       onUpdate={this.updateRelationshipStatus}
                       onValidate={this.handleValidation}
                       />
          </SectionView>
        </SectionViews>
      </div>
    )
  }
}

function mapStateToProps (state) {
  let section = state.section || {}
  let app = state.application || {}
  let relationships = app.Relationships || {}
  let errors = app.Errors || {}
  let completed = app.Completed || {}
  return {
    Section: section,
    Relationships: relationships,
    Relatives: relationships.Relatives || {},
    RelationshipStatus: relationships.RelationshipStatus || {},
    Marital: relationships.Marital || {},
    Friends: relationships.Friends || {},
    Errors: errors.relationships || [],
    Completed: completed.relationships || []
  }
}

Relationships.defaultProps = {
  subsection: ''
}

export default connect(mapStateToProps)(AuthenticatedView(Relationships))
